/**
 * Example: Flexible Search Implementation
 * 
 * This shows how to implement the 2-month flexible search with async processing
 */

import Bull from 'bull';
import { Redis } from 'ioredis';
import { WebSocket } from 'ws';

// ============================================
// 1. Types & Interfaces
// ============================================

interface FlexibleSearchParams {
  origin: string;
  destination: string;
  centerDate: Date;
  duration: number; // nights
  passengers: {
    adults: number;
    children: number;
  };
  searchRange: 'week' | 'month' | 'two-months';
}

interface FlightOption {
  outboundDate: string;
  returnDate: string;
  totalPrice: number;
  currency: string;
  airline: string;
  stops: number;
  duration: string;
  savings: number;
  savingsPercentage: number;
  deepLink: string;
}

interface SearchJob {
  jobId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: {
    total: number;
    checked: number;
    percentage: number;
    estimatedTimeLeft: number;
  };
  results: {
    topFive: FlightOption[];
    priceCalendar: Record<string, number>;
    statistics: {
      cheapestDate: string;
      mostExpensiveDate: string;
      averagePrice: number;
      totalOptionsFound: number;
    };
  };
}

// ============================================
// 2. Queue Setup
// ============================================

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});

const flexibleSearchQueue = new Bull<{
  jobId: string;
  userId: string;
  params: FlexibleSearchParams;
  dateRange: Date[];
}>('flexible-search', {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 200,     // Keep last 200 failed jobs
  },
});

// ============================================
// 3. Helper Functions
// ============================================

function generateDateRange(
  centerDate: Date,
  range: 'week' | 'month' | 'two-months'
): Date[] {
  const dates: Date[] = [];
  
  let daysBefore = 3;
  let daysAfter = 3;
  
  if (range === 'month') {
    daysBefore = 15;
    daysAfter = 15;
  } else if (range === 'two-months') {
    daysBefore = 30;
    daysAfter = 30;
  }
  
  for (let i = -daysBefore; i <= daysAfter; i++) {
    const date = new Date(centerDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateEstimatedTime(
  checkedCount: number,
  totalCount: number,
  elapsedTime: number
): number {
  if (checkedCount === 0) return totalCount * 2; // Initial estimate: 2 sec per date
  
  const avgTimePerDate = elapsedTime / checkedCount;
  const remainingDates = totalCount - checkedCount;
  return Math.round(avgTimePerDate * remainingDates);
}

// ============================================
// 4. API Integration (Mock)
// ============================================

async function searchFlightsForDate(
  params: FlexibleSearchParams,
  outboundDate: Date
): Promise<FlightOption | null> {
  
  const returnDate = addDays(outboundDate, params.duration);
  
  // Create cache key
  const cacheKey = `flight:${params.origin}:${params.destination}:${outboundDate.toISOString()}:${params.duration}`;
  
  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`✅ Cache hit for ${outboundDate.toISOString().split('T')[0]}`);
    return JSON.parse(cached);
  }
  
  console.log(`🔍 Searching API for ${outboundDate.toISOString().split('T')[0]}`);
  
  try {
    // Call external API (Skyscanner, Amadeus, etc.)
    // This is a mock implementation
    const response = await mockSkyscannerAPI({
      origin: params.origin,
      destination: params.destination,
      outboundDate: outboundDate,
      returnDate: returnDate,
      adults: params.passengers.adults,
      children: params.passengers.children,
    });
    
    if (!response || !response.flights || response.flights.length === 0) {
      return null;
    }
    
    // Get cheapest flight
    const cheapest = response.flights
      .sort((a, b) => a.price - b.price)[0];
    
    const result: FlightOption = {
      outboundDate: outboundDate.toISOString(),
      returnDate: returnDate.toISOString(),
      totalPrice: cheapest.price,
      currency: 'EUR',
      airline: cheapest.airline,
      stops: cheapest.stops,
      duration: cheapest.duration,
      savings: 0, // Will be calculated later
      savingsPercentage: 0,
      deepLink: cheapest.deepLink,
    };
    
    // Cache result for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(result));
    
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to search for date ${outboundDate}:`, error.message);
    return null;
  }
}

// Mock API function (replace with real Skyscanner/Amadeus API)
async function mockSkyscannerAPI(params: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Simulate occasional failures (5% of the time)
  if (Math.random() < 0.05) {
    throw new Error('API rate limit exceeded');
  }
  
  // Generate mock data with realistic price variations
  const basePrice = 200;
  const variation = Math.random() * 200 - 50; // -50 to +150
  const price = Math.round(basePrice + variation);
  
  return {
    flights: [
      {
        price: price,
        airline: ['Wizz Air', 'Ryanair', 'Lufthansa'][Math.floor(Math.random() * 3)],
        stops: Math.random() > 0.7 ? 1 : 0,
        duration: `${2 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`,
        deepLink: `https://booking.example.com/flight/${Math.random().toString(36).substr(2, 9)}`,
      }
    ]
  };
}

// ============================================
// 5. Job Processing Logic
// ============================================

flexibleSearchQueue.process(5, async (job) => {
  const { jobId, userId, params, dateRange } = job.data;
  
  console.log(`🚀 Processing job ${jobId} for user ${userId}`);
  console.log(`   Range: ${params.origin} → ${params.destination}`);
  console.log(`   Dates to check: ${dateRange.length}`);
  
  try {
    // Update status to processing
    await updateJobInRedis(jobId, { status: 'processing' });
    
    const allResults: FlightOption[] = [];
    const priceCalendar: Record<string, number> = {};
    
    let checkedCount = 0;
    const startTime = Date.now();
    
    // Process dates in batches of 10
    const BATCH_SIZE = 10;
    
    for (let i = 0; i < dateRange.length; i += BATCH_SIZE) {
      const batch = dateRange.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel
      const batchPromises = batch.map(date => 
        searchFlightsForDate(params, date)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Extract successful results
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        if (result.status === 'fulfilled' && result.value) {
          allResults.push(result.value);
          priceCalendar[result.value.outboundDate] = result.value.totalPrice;
        }
      }
      
      checkedCount += batch.length;
      
      // Calculate progress
      const percentage = Math.round((checkedCount / dateRange.length) * 100);
      const elapsed = (Date.now() - startTime) / 1000;
      const estimatedTimeLeft = calculateEstimatedTime(
        checkedCount,
        dateRange.length,
        elapsed
      );
      
      // Get current top 5
      const currentTopFive = allResults
        .sort((a, b) => a.totalPrice - b.totalPrice)
        .slice(0, 5);
      
      // Update progress in Redis
      await updateJobInRedis(jobId, {
        progress: {
          total: dateRange.length,
          checked: checkedCount,
          percentage,
          estimatedTimeLeft,
        },
        results: {
          topFive: currentTopFive,
          priceCalendar,
        }
      });
      
      // Send WebSocket update
      await sendWebSocketUpdate(jobId, {
        type: 'progress',
        progress: percentage,
        checked: checkedCount,
        total: dateRange.length,
        topFive: currentTopFive,
        estimatedTimeLeft,
      });
      
      console.log(`   Progress: ${percentage}% (${checkedCount}/${dateRange.length})`);
      
      // Rate limiting: wait 500ms between batches
      if (i + BATCH_SIZE < dateRange.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Calculate statistics
    const prices = Object.values(priceCalendar);
    const averagePrice = Math.round(
      prices.reduce((a, b) => a + b, 0) / prices.length
    );
    
    const sortedPrices = Object.entries(priceCalendar)
      .sort(([, a], [, b]) => a - b);
    
    const cheapestDate = sortedPrices[0][0];
    const mostExpensiveDate = sortedPrices[sortedPrices.length - 1][0];
    
    // Calculate final top 5 with savings
    const finalTopFive = allResults
      .sort((a, b) => a.totalPrice - b.totalPrice)
      .slice(0, 5)
      .map(option => ({
        ...option,
        savings: Math.round(averagePrice - option.totalPrice),
        savingsPercentage: Math.round(
          ((averagePrice - option.totalPrice) / averagePrice) * 100
        ),
      }));
    
    // Update job as completed
    await updateJobInRedis(jobId, {
      status: 'completed',
      progress: {
        total: dateRange.length,
        checked: dateRange.length,
        percentage: 100,
        estimatedTimeLeft: 0,
      },
      results: {
        topFive: finalTopFive,
        priceCalendar,
        statistics: {
          cheapestDate,
          mostExpensiveDate,
          averagePrice,
          totalOptionsFound: allResults.length,
        },
      },
    });
    
    // Send completion WebSocket message
    await sendWebSocketUpdate(jobId, {
      type: 'completed',
      topFive: finalTopFive,
      statistics: {
        cheapestDate,
        mostExpensiveDate,
        averagePrice,
        totalOptionsFound: allResults.length,
      },
    });
    
    console.log(`✅ Job ${jobId} completed successfully!`);
    console.log(`   Found ${allResults.length} options`);
    console.log(`   Best price: €${finalTopFive[0].totalPrice}`);
    console.log(`   Average savings: €${finalTopFive[0].savings}`);
    
    // Send notification to user
    await sendNotification(userId, {
      title: '🎉 Best Prices Found!',
      body: `${params.origin} → ${params.destination}: From €${finalTopFive[0].totalPrice} (Save €${finalTopFive[0].savings}!)`,
      data: { jobId },
    });
    
    return {
      success: true,
      topFive: finalTopFive,
      totalFound: allResults.length,
    };
    
  } catch (error) {
    console.error(`❌ Job ${jobId} failed:`, error);
    
    await updateJobInRedis(jobId, {
      status: 'failed',
      error: error.message,
    });
    
    throw error;
  }
});

// ============================================
// 6. Helper Functions for Redis & WebSocket
// ============================================

async function updateJobInRedis(jobId: string, updates: Partial<SearchJob>) {
  const key = `flexible-search:${jobId}`;
  const existing = await redis.get(key);
  
  if (!existing) {
    throw new Error(`Job ${jobId} not found`);
  }
  
  const job = JSON.parse(existing);
  const updated = { ...job, ...updates, updatedAt: new Date() };
  
  await redis.setex(key, 3600, JSON.stringify(updated));
}

async function sendWebSocketUpdate(jobId: string, data: any) {
  // Publish to Redis pub/sub channel
  // This will be picked up by WebSocket server
  await redis.publish(
    `ws:flexible-search:${jobId}`,
    JSON.stringify(data)
  );
}

async function sendNotification(userId: string, notification: any) {
  // Send push notification
  console.log(`📱 Sending notification to user ${userId}:`, notification.title);
  
  // In real implementation:
  // - Send push notification via Firebase
  // - Send email via SendGrid
  // - Create in-app notification
}

// ============================================
// 7. Queue Event Handlers
// ============================================

flexibleSearchQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

flexibleSearchQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

flexibleSearchQueue.on('progress', (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

flexibleSearchQueue.on('stalled', (job) => {
  console.warn(`⚠️  Job ${job.id} stalled`);
});

// ============================================
// 8. Example Usage
// ============================================

async function exampleCreateFlexibleSearch() {
  const jobId = `job_${Date.now()}`;
  const userId = 'user_123';
  
  const params: FlexibleSearchParams = {
    origin: 'OTP', // București
    destination: 'BCN', // Barcelona
    centerDate: new Date('2024-03-15'),
    duration: 5, // 5 nights
    passengers: {
      adults: 2,
      children: 0,
    },
    searchRange: 'two-months',
  };
  
  const dateRange = generateDateRange(params.centerDate, params.searchRange);
  
  // Create initial job in Redis
  await redis.setex(
    `flexible-search:${jobId}`,
    3600,
    JSON.stringify({
      jobId,
      userId,
      status: 'pending',
      createdAt: new Date(),
      params,
      progress: {
        total: dateRange.length,
        checked: 0,
        percentage: 0,
        estimatedTimeLeft: dateRange.length * 2,
      },
      results: {
        topFive: [],
        priceCalendar: {},
        statistics: null,
      },
    })
  );
  
  // Add job to queue
  await flexibleSearchQueue.add({
    jobId,
    userId,
    params,
    dateRange,
  }, {
    priority: 1,
    jobId: jobId,
  });
  
  console.log(`🚀 Created flexible search job: ${jobId}`);
  console.log(`   Will search ${dateRange.length} dates`);
  
  return {
    jobId,
    totalDates: dateRange.length,
    estimatedTime: dateRange.length * 2,
    statusUrl: `/api/search/flexible/${jobId}`,
    websocketUrl: `wss://api.booksygo.com/ws/flexible-search/${jobId}`,
  };
}

// Run example (for testing)
if (require.main === module) {
  exampleCreateFlexibleSearch()
    .then(result => {
      console.log('✅ Example completed:', result);
    })
    .catch(err => {
      console.error('❌ Example failed:', err);
    });
}

export {
  flexibleSearchQueue,
  generateDateRange,
  searchFlightsForDate,
  exampleCreateFlexibleSearch,
};

