# 🔍 Flexible Search Feature - Extended 2 Months Async Processing

## Overview

Advanced flexible date search that scans **2 months** of dates to find the **top 5 best price options** using asynchronous background processing.

---

## 🎯 Feature Specifications

### User Flow

1. **User inputs search criteria**:
   - Origin: București (OTP)
   - Destination: Barcelona (BCN)
   - Approximate date: 15 March 2024
   - Duration: 5 nights
   - Passengers: 2 adults

2. **User selects "Find Best Prices" option**:
   - Toggle: "Search flexible dates (±1 month)"
   - System will search: 15 Feb - 15 April (2 months)

3. **Immediate Response**:
   - Job ID created
   - User sees progress bar
   - "Searching 60 date combinations..."

4. **Real-time Updates**:
   - WebSocket updates every 5-10 seconds
   - Show progress: "Checked 15/60 dates..."
   - Display top 5 results so far

5. **Complete Results**:
   - Top 5 cheapest options displayed
   - Calendar heatmap showing all prices
   - Notifications sent (push, email)

---

## 🏗️ Architecture

```
┌─────────────────┐
│   User Action   │
│  "Find Best"    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│    API Gateway              │
│  POST /api/search/flexible  │
└────────┬────────────────────┘
         │
         ├──► Create Job ID
         │    Return immediately
         │
         ▼
┌─────────────────────────────┐
│    RabbitMQ Queue           │
│  "flexible-search-jobs"     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Worker Processes (3-5)    │
│   Process in parallel       │
└────────┬────────────────────┘
         │
         ├──► Query External APIs
         │    (Skyscanner, Amadeus)
         │
         ├──► Store in Redis
         │    (partial results)
         │
         ├──► WebSocket Update
         │    (progress to client)
         │
         └──► Final Result
              Store in PostgreSQL
              Send notification
```

---

## 💾 Data Structure

### Job Schema (Redis)

```typescript
interface FlexibleSearchJob {
  jobId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  
  // Search parameters
  params: {
    origin: string;
    destination: string;
    centerDate: Date;
    duration: number; // nights
    passengers: {
      adults: number;
      children: number;
    };
    searchRange: 'week' | 'month' | 'two-months';
  };
  
  // Progress tracking
  progress: {
    total: number;        // Total dates to check
    checked: number;      // Dates checked so far
    percentage: number;   // Progress %
    estimatedTimeLeft: number; // seconds
  };
  
  // Results
  results: {
    topFive: FlightOption[];
    priceCalendar: Record<string, number>; // date -> price
    cheapestDate: string;
    mostExpensiveDate: string;
    averagePrice: number;
  };
}

interface FlightOption {
  outboundDate: string;
  returnDate: string;
  totalPrice: number;
  currency: string;
  
  flights: {
    outbound: FlightSegment;
    return: FlightSegment;
  };
  
  savings: number; // vs average price
  savingsPercentage: number;
  
  bookingUrl: string;
  deepLink: string;
}
```

---

## 🔧 Implementation

### 1. API Endpoint

**File**: `services/search-service/src/routes/flexible-search.ts`

```typescript
import { FastAPI, BackgroundTasks } from 'fastapi';
import { v4 as uuidv4 } from 'uuid';

router = FastAPI();

@router.post("/api/search/flexible")
async function createFlexibleSearch(
  searchParams: FlexibleSearchParams,
  userId: string,
  backgroundTasks: BackgroundTasks
): Promise<FlexibleSearchJobResponse> {
  
  // Generate job ID
  const jobId = uuidv4();
  
  // Calculate date range
  const centerDate = new Date(searchParams.centerDate);
  const dateRange = generateDateRange(
    centerDate,
    searchParams.searchRange // 'two-months'
  );
  
  // Create job in Redis
  await redis.setex(
    `flexible-search:${jobId}`,
    3600, // 1 hour TTL
    JSON.stringify({
      jobId,
      userId,
      status: 'pending',
      createdAt: new Date(),
      params: searchParams,
      progress: {
        total: dateRange.length,
        checked: 0,
        percentage: 0,
        estimatedTimeLeft: dateRange.length * 2 // ~2 sec per date
      },
      results: {
        topFive: [],
        priceCalendar: {},
      }
    })
  );
  
  // Add job to queue (non-blocking)
  await queue.add('flexible-search', {
    jobId,
    userId,
    searchParams,
    dateRange,
  }, {
    priority: 1,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
  
  // Return immediately
  return {
    jobId,
    status: 'pending',
    totalDates: dateRange.length,
    estimatedTime: dateRange.length * 2,
    websocketUrl: `wss://api.booksygo.com/ws/flexible-search/${jobId}`,
    pollUrl: `/api/search/flexible/${jobId}`
  };
}

@router.get("/api/search/flexible/{jobId}")
async function getFlexibleSearchStatus(jobId: string): Promise<FlexibleSearchJob> {
  const jobData = await redis.get(`flexible-search:${jobId}`);
  
  if (!jobData) {
    throw new HTTPException(404, "Job not found");
  }
  
  return JSON.parse(jobData);
}
```

---

### 2. Background Worker

**File**: `services/search-service/src/workers/flexible-search-worker.ts`

```typescript
import Bull from 'bull';
import { chunk } from 'lodash';

const flexibleSearchQueue = new Bull('flexible-search', {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD
  }
});

// Process jobs with concurrency
flexibleSearchQueue.process(5, async (job) => {
  const { jobId, userId, searchParams, dateRange } = job.data;
  
  try {
    // Update status to processing
    await updateJobStatus(jobId, 'processing');
    
    // Split dates into batches (process 10 at a time)
    const dateBatches = chunk(dateRange, 10);
    
    const allResults: FlightOption[] = [];
    const priceCalendar: Record<string, number> = {};
    
    let checkedCount = 0;
    const startTime = Date.now();
    
    for (const batch of dateBatches) {
      // Process batch in parallel
      const batchResults = await Promise.allSettled(
        batch.map(date => searchFlightsForDate(searchParams, date))
      );
      
      // Extract successful results
      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value) {
          allResults.push(result.value);
          priceCalendar[result.value.outboundDate] = result.value.totalPrice;
        }
      }
      
      checkedCount += batch.length;
      
      // Update progress
      const percentage = Math.round((checkedCount / dateRange.length) * 100);
      const elapsed = (Date.now() - startTime) / 1000;
      const estimatedTotal = (elapsed / checkedCount) * dateRange.length;
      const estimatedTimeLeft = Math.max(0, estimatedTotal - elapsed);
      
      await updateJobProgress(jobId, {
        total: dateRange.length,
        checked: checkedCount,
        percentage,
        estimatedTimeLeft: Math.round(estimatedTimeLeft)
      });
      
      // Sort and get top 5
      const topFive = allResults
        .sort((a, b) => a.totalPrice - b.totalPrice)
        .slice(0, 5);
      
      // Update partial results
      await updateJobResults(jobId, {
        topFive,
        priceCalendar,
      });
      
      // Send WebSocket update
      await sendWebSocketUpdate(jobId, {
        progress: percentage,
        topFive,
      });
      
      // Rate limiting: wait 1 second between batches
      await sleep(1000);
    }
    
    // Calculate final statistics
    const prices = Object.values(priceCalendar);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const cheapestDate = Object.entries(priceCalendar)
      .sort(([, a], [, b]) => a - b)[0][0];
    const mostExpensiveDate = Object.entries(priceCalendar)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    // Final top 5 with savings calculation
    const finalTopFive = allResults
      .sort((a, b) => a.totalPrice - b.totalPrice)
      .slice(0, 5)
      .map(option => ({
        ...option,
        savings: averagePrice - option.totalPrice,
        savingsPercentage: Math.round(
          ((averagePrice - option.totalPrice) / averagePrice) * 100
        )
      }));
    
    // Update job as completed
    await updateJobStatus(jobId, 'completed');
    await updateJobResults(jobId, {
      topFive: finalTopFive,
      priceCalendar,
      cheapestDate,
      mostExpensiveDate,
      averagePrice: Math.round(averagePrice),
    });
    
    // Send notifications
    await sendPushNotification(userId, {
      title: 'Best Prices Found! 🎉',
      body: `Top deal: ${finalTopFive[0].totalPrice}€ (Save ${finalTopFive[0].savings}€)`,
      data: { jobId }
    });
    
    await sendEmail(userId, {
      template: 'flexible-search-complete',
      data: { topFive: finalTopFive, jobId }
    });
    
    // Store in PostgreSQL for analytics
    await storeSearchResults(jobId, finalTopFive);
    
  } catch (error) {
    console.error('Flexible search failed:', error);
    await updateJobStatus(jobId, 'failed');
    throw error;
  }
});

async function searchFlightsForDate(
  params: FlexibleSearchParams,
  outboundDate: Date
): Promise<FlightOption | null> {
  
  // Check cache first
  const cacheKey = `flight:${params.origin}:${params.destination}:${outboundDate.toISOString()}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Call external API
  try {
    const response = await skyscannerAPI.search({
      origin: params.origin,
      destination: params.destination,
      outboundDate: outboundDate,
      returnDate: addDays(outboundDate, params.duration),
      passengers: params.passengers,
    });
    
    if (!response.flights || response.flights.length === 0) {
      return null;
    }
    
    // Get cheapest option
    const cheapest = response.flights
      .sort((a, b) => a.price - b.price)[0];
    
    const result: FlightOption = {
      outboundDate: outboundDate.toISOString(),
      returnDate: addDays(outboundDate, params.duration).toISOString(),
      totalPrice: cheapest.price,
      currency: 'EUR',
      flights: cheapest,
      bookingUrl: cheapest.deepLink,
      deepLink: cheapest.deepLink,
      savings: 0, // calculated later
      savingsPercentage: 0,
    };
    
    // Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(result));
    
    return result;
    
  } catch (error) {
    console.error(`Failed to search for date ${outboundDate}:`, error);
    return null;
  }
}
```

---

### 3. WebSocket Handler

**File**: `services/search-service/src/websocket/flexible-search.ts`

```typescript
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Store active connections by jobId
const connections = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws, req) => {
  // Extract jobId from URL: /ws/flexible-search/:jobId
  const jobId = req.url?.split('/').pop();
  
  if (!jobId) {
    ws.close(1008, 'Invalid job ID');
    return;
  }
  
  // Add connection to set
  if (!connections.has(jobId)) {
    connections.set(jobId, new Set());
  }
  connections.get(jobId)!.add(ws);
  
  console.log(`Client connected to job ${jobId}`);
  
  // Send current status immediately
  sendCurrentStatus(ws, jobId);
  
  ws.on('close', () => {
    connections.get(jobId)?.delete(ws);
    if (connections.get(jobId)?.size === 0) {
      connections.delete(jobId);
    }
    console.log(`Client disconnected from job ${jobId}`);
  });
});

export async function sendWebSocketUpdate(
  jobId: string,
  update: {
    progress: number;
    topFive: FlightOption[];
  }
) {
  const clients = connections.get(jobId);
  
  if (!clients || clients.size === 0) {
    return;
  }
  
  const message = JSON.stringify({
    type: 'progress',
    jobId,
    timestamp: new Date(),
    data: update
  });
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

async function sendCurrentStatus(ws: WebSocket, jobId: string) {
  const jobData = await redis.get(`flexible-search:${jobId}`);
  
  if (jobData) {
    ws.send(JSON.stringify({
      type: 'status',
      jobId,
      data: JSON.parse(jobData)
    }));
  }
}
```

---

### 4. Frontend Implementation

**File**: `frontend/app/search/flexible/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function FlexibleSearchPage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [topFive, setTopFive] = useState<FlightOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { messages } = useWebSocket(
    jobId ? `wss://api.booksygo.com/ws/flexible-search/${jobId}` : null
  );
  
  // Handle WebSocket messages
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage?.type === 'progress') {
      setProgress(latestMessage.data.progress);
      setTopFive(latestMessage.data.topFive);
    }
    
    if (latestMessage?.type === 'status' && latestMessage.data.status === 'completed') {
      setIsSearching(false);
      showNotification('Best prices found!');
    }
  }, [messages]);
  
  const handleFlexibleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    
    const response = await fetch('/api/search/flexible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        searchRange: 'two-months'
      })
    });
    
    const data = await response.json();
    setJobId(data.jobId);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Flexible Date Search
      </h1>
      
      <SearchForm onSubmit={handleFlexibleSearch} />
      
      {isSearching && (
        <div className="mt-8">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Searching {progress}% complete
              </span>
              <span className="text-sm text-gray-500">
                {topFive.length > 0 && `${topFive.length} options found so far`}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Top 5 Results (Live Update) */}
          {topFive.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Top 5 Best Prices (so far)
              </h2>
              
              {topFive.map((option, index) => (
                <FlightCard
                  key={index}
                  option={option}
                  rank={index + 1}
                  showSavings={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## ⚡ Performance Optimizations

### 1. Caching Strategy

```typescript
// Cache layers
const CACHE_STRATEGY = {
  // Individual flight search: 10 minutes
  flightSearch: {
    ttl: 600,
    key: (params) => `flight:${params.origin}:${params.destination}:${params.date}`
  },
  
  // Flexible search job: 1 hour
  flexibleJob: {
    ttl: 3600,
    key: (jobId) => `flexible-search:${jobId}`
  },
  
  // Price calendar: 30 minutes
  priceCalendar: {
    ttl: 1800,
    key: (route) => `calendar:${route.origin}:${route.destination}`
  }
};
```

### 2. Parallel Processing

- Process **10 dates simultaneously**
- Use **5 worker instances** for scaling
- Implement **circuit breaker** for API failures
- **Rate limiting**: 1 second pause between batches

### 3. Smart Scheduling

```typescript
// Priority queue based on user tier
const PRIORITY_LEVELS = {
  premium: 1,      // Process immediately
  regular: 5,      // Normal priority
  free: 10         // Lower priority
};

await queue.add('flexible-search', jobData, {
  priority: PRIORITY_LEVELS[user.tier]
});
```

---

## 📊 Cost Analysis

### API Call Costs

**Skyscanner API**: ~€0.01 per search

**For 60 dates** (2 months):
- Cost per flexible search: €0.60
- With 50% cache hit rate: €0.30
- Monthly (1000 searches): €300

**Optimization**:
- Popular routes: Pre-warm cache daily
- Share results between users (anonymized)
- Batch API calls for better rates

---

## 📈 User Benefits

### Value Proposition

**Example Savings**:
```
User searches: București → Barcelona
Standard search (exact dates): €350

Flexible search finds:
#1: March 8-13:  €189 (Save €161 - 46%)
#2: March 15-20: €210 (Save €140 - 40%)
#3: April 3-8:   €225 (Save €125 - 36%)
#4: Feb 28-Mar5: €240 (Save €110 - 31%)
#5: March 22-27: €255 (Save €95 - 27%)
```

**Time Value**: 
- Manual search: 2 hours
- Our tool: 2 minutes (automated)
- User saves: ~€100-200 + 2 hours

---

## 🎨 UI/UX Enhancements

### Price Calendar Heatmap

```typescript
<PriceCalendar
  prices={priceCalendar}
  colorScale={{
    low: '#10B981',    // Green
    medium: '#F59E0B', // Yellow
    high: '#EF4444'    // Red
  }}
  onDateClick={(date) => showFlightDetails(date)}
/>
```

### Smart Recommendations

```typescript
// Show insights
<InsightCard>
  💡 Best time to travel: First week of March
  📊 Average savings: €120 (35%)
  📅 Cheapest day: Tuesday
  ⏰ Best booking time: 2-3 weeks before
</InsightCard>
```

---

## 🔔 Notifications

### Push Notification
```json
{
  "title": "🎉 Best Prices Found!",
  "body": "București → Barcelona: From €189 (Save €161!)",
  "image": "calendar-preview.png",
  "actions": [
    { "action": "view", "title": "View Results" },
    { "action": "book", "title": "Book Now" }
  ]
}
```

### Email Template
- Subject: "Your Flexible Search Results: Save up to €161!"
- Top 5 options with images
- Price calendar visualization
- "Book now" CTA buttons

---

## 🚀 Future Enhancements

1. **AI Price Prediction**
   - "Wait 3 days, prices likely to drop by 15%"
   - Historical data analysis

2. **Multi-City Search**
   - Find best prices for 3-4 destinations
   - "Where can I go for €200?"

3. **Budget-First Search**
   - "Show me best destinations for €500"
   - Reverse search engine

4. **Group Optimization**
   - Find best dates for 4+ people
   - Minimize total cost for group

5. **Carbon-Aware**
   - Show eco-friendly options
   - Carbon offset integration

---

## 📝 Implementation Checklist

- [ ] Setup Bull queue for background jobs
- [ ] Implement worker process for parallel date checking
- [ ] Add WebSocket support for real-time updates
- [ ] Create Redis schemas for job tracking
- [ ] Build API endpoints (create, status, cancel)
- [ ] Frontend: Progress bar UI
- [ ] Frontend: Top 5 results display
- [ ] Frontend: Price calendar heatmap
- [ ] Implement caching strategy
- [ ] Add push notifications
- [ ] Email notifications
- [ ] Analytics tracking
- [ ] Load testing (1000 concurrent jobs)
- [ ] Cost monitoring
- [ ] Documentation

---

**Estimated Development Time**: 2-3 weeks

**Priority**: High (Major differentiator!)

**Impact**: 🔥🔥🔥 Game-changing feature!

