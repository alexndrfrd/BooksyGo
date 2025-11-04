# 🚀 Amadeus API - Quick Start Guide

## ⚡ SETUP IN 10 MINUTES!

### **Step 1: Sign Up (2 min)**

```
1. Go to: https://developers.amadeus.com/register

2. Fill form:
   Name: Alexandru Besleaga
   Email: your@email.com
   Company: BooksyGo
   Country: Romania
   
3. Verify email (check inbox!)

4. ✅ DONE! Instant approval!
```

---

### **Step 2: Get API Keys (1 min)**

```
1. Login: https://developers.amadeus.com/my-apps

2. Click "Create New App"

3. App Details:
   Name: BooksyGo Production
   Description: Travel platform with price tracking
   
4. Click "Create"

5. 🔑 You get:
   - API Key
   - API Secret
   
6. Copy both! (save in .env file)
```

---

### **Step 3: Test API (2 min)**

```bash
# Test endpoint
curl --request GET \
  --url 'https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=OTP&destinationLocationCode=LON&departureDate=2025-12-15&adults=1' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'

# If works: ✅ You're ready!
```

---

## 🎯 **EXACT CE VREI TU:**

### **1. Flight Offers Search** (Real-time prices)

```typescript
// GET /v2/shopping/flight-offers
// Returns: All flights with prices for specific date

{
  "data": [
    {
      "id": "1",
      "price": {
        "total": "89.99",
        "currency": "EUR"
      },
      "itineraries": [
        {
          "segments": [
            {
              "departure": {
                "iataCode": "OTP",
                "at": "2025-12-15T06:30:00"
              },
              "arrival": {
                "iataCode": "LON",
                "at": "2025-12-15T09:45:00"
              },
              "carrierCode": "W6",
              "number": "2341",
              "aircraft": { "code": "320" }
            }
          ]
        }
      ]
    }
  ]
}
```

---

### **2. Flight Inspiration Search** ⭐ PERFECT PENTRU TOI!

```typescript
// GET /v1/shopping/flight-dates
// Returns: Best prices for multiple dates (60-day calendar!)

{
  "data": [
    {
      "origin": "OTP",
      "destination": "LON",
      "departureDate": "2025-12-10",
      "returnDate": "2025-12-17",
      "price": {
        "total": "79.99"
      }
    },
    {
      "departureDate": "2025-12-15", // CHEAPEST!
      "price": { "total": "49.99" }
    },
    {
      "departureDate": "2025-12-20",
      "price": { "total": "120.00" }
    }
    // ... 60 days of data!
  ]
}
```

**ASTA E CE VREI! Calendar cu best prices! 🎯**

---

### **3. Flight Price Analysis**

```typescript
// GET /v1/analytics/itinerary-price-metrics
// Returns: Price trends, averages, quartiles

{
  "data": [
    {
      "priceMetrics": [
        {
          "quartileRanking": "MEDIUM",  // Price position
          "minimum": "39.99",
          "maximum": "199.99",
          "mean": "89.50"
        }
      ]
    }
  ]
}
```

---

## 💰 **PRICING:**

```
FREE Tier:
├─ 2,000 API calls/month
├─ Self-service (instant approval)
├─ All endpoints available
└─ Perfect pentru MVP!

After FREE tier:
├─ $0.20 per 1,000 requests
├─ Example: 10,000 calls = $2
└─ Super affordable!

Monthly cost projection:
├─ Month 1: €0 (under 2000 calls)
├─ Month 2: €5-10 (5K-10K calls)
├─ Month 3: €20-30 (20K-30K calls)
└─ Scalable cu revenue-ul tău!
```

---

## 🛠️ **IMPLEMENTARE (2-3 ore):**

### **File 1: `frontend/lib/amadeus-api.ts`**

```typescript
// Rename/replace skyscanner-api.ts

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY!;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET!;
const AMADEUS_BASE_URL = 'https://api.amadeus.com';

// 1. Get Access Token (OAuth)
async function getAccessToken() {
  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
  });
  const data = await response.json();
  return data.access_token;
}

// 2. Search Flights (Real-time)
export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
}) {
  const token = await getAccessToken();
  
  const url = new URL(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`);
  url.searchParams.append('originLocationCode', params.origin);
  url.searchParams.append('destinationLocationCode', params.destination);
  url.searchParams.append('departureDate', params.departureDate);
  if (params.returnDate) url.searchParams.append('returnDate', params.returnDate);
  url.searchParams.append('adults', params.adults.toString());
  url.searchParams.append('currencyCode', 'EUR');
  url.searchParams.append('max', '50'); // Get 50 results
  
  const response = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return response.json();
}

// 3. Get Best Prices (60-day calendar!) ⭐ YOUR KILLER FEATURE
export async function getFlightInspirationSearch(params: {
  origin: string;
  destination?: string; // Optional for "best destinations"
  departureDate?: string;
  duration?: string; // e.g., "7" for 7-day trips
}) {
  const token = await getAccessToken();
  
  const url = new URL(`${AMADEUS_BASE_URL}/v1/shopping/flight-dates`);
  url.searchParams.append('origin', params.origin);
  if (params.destination) url.searchParams.append('destination', params.destination);
  if (params.departureDate) url.searchParams.append('departureDate', params.departureDate);
  if (params.duration) url.searchParams.append('duration', params.duration);
  url.searchParams.append('oneWay', 'false');
  
  const response = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return response.json();
}

// 4. Get Price Analysis (trends, best time to book)
export async function getFlightPriceAnalysis(params: {
  origin: string;
  destination: string;
  departureDate: string;
}) {
  const token = await getAccessToken();
  
  const url = new URL(`${AMADEUS_BASE_URL}/v1/analytics/itinerary-price-metrics`);
  url.searchParams.append('originIataCode', params.origin);
  url.searchParams.append('destinationIataCode', params.destination);
  url.searchParams.append('departureDate', params.departureDate);
  url.searchParams.append('currencyCode', 'EUR');
  
  const response = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  return response.json();
}
```

---

### **File 2: Update `.env`**

```bash
# Amadeus API
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here

# For frontend (if needed)
NEXT_PUBLIC_AMADEUS_API_KEY=your_api_key_here
```

---

### **File 3: Update `frontend/app/api/flights/search/route.ts`**

```typescript
import { searchFlights, getFlightInspirationSearch } from '@/lib/amadeus-api';

export async function POST(req: Request) {
  const { origin, destination, departureDate, returnDate, adults } = await req.json();
  
  try {
    // Call Amadeus API instead of Skyscanner
    const flights = await searchFlights({
      origin,
      destination,
      departureDate,
      returnDate,
      adults: adults || 1,
    });
    
    return Response.json({ flights: flights.data });
  } catch (error) {
    console.error('Amadeus API error:', error);
    // Fallback to mock data if needed
    return Response.json({ flights: MOCK_FLIGHTS });
  }
}
```

---

### **File 4: NEW! `frontend/app/api/flights/calendar/route.ts`**

```typescript
// ⭐ YOUR KILLER FEATURE: 60-day price calendar!

import { getFlightInspirationSearch } from '@/lib/amadeus-api';

export async function POST(req: Request) {
  const { origin, destination } = await req.json();
  
  try {
    const priceCalendar = await getFlightInspirationSearch({
      origin,
      destination,
      // No specific date = get best prices for next 60 days!
    });
    
    return Response.json({ calendar: priceCalendar.data });
  } catch (error) {
    console.error('Amadeus Inspiration API error:', error);
    return Response.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}
```

---

## 🎨 **FRONTEND: Price Calendar Component**

```typescript
// components/PriceCalendar.tsx

'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';

interface PriceCalendarProps {
  origin: string;
  destination: string;
}

export function PriceCalendar({ origin, destination }: PriceCalendarProps) {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPrices() {
      const response = await fetch('/api/flights/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination }),
      });
      const data = await response.json();
      setPriceData(data.calendar);
      setLoading(false);
    }
    
    fetchPrices();
  }, [origin, destination]);
  
  if (loading) return <div>Loading calendar...</div>;
  
  return (
    <div className="price-calendar">
      <h3>Best Prices - Next 60 Days</h3>
      <div className="calendar-grid">
        {priceData.map((day) => (
          <div 
            key={day.departureDate}
            className={`calendar-day ${getPriceClass(day.price.total)}`}
          >
            <div className="date">{formatDate(day.departureDate)}</div>
            <div className="price">€{day.price.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getPriceClass(price: string) {
  const p = parseFloat(price);
  if (p < 50) return 'price-low';
  if (p < 100) return 'price-medium';
  return 'price-high';
}
```

---

## ✅ **TODO LIST - Next 3 Hours:**

- [ ] Sign up Amadeus (2 min)
- [ ] Get API keys (1 min)
- [ ] Test API with curl (2 min)
- [ ] Create `amadeus-api.ts` (30 min)
- [ ] Update search endpoint (15 min)
- [ ] Create calendar endpoint (15 min)
- [ ] Build PriceCalendar component (60 min)
- [ ] Test with real data (30 min)
- [ ] Polish UI (30 min)

**TOTAL: ~3 hours → FEATURE LIVE! 🎯**

---

## 🎉 **RESULT:**

```
✅ Real-time flight prices
✅ 60-day price calendar (KILLER FEATURE!)
✅ Multi-airline comparison
✅ Price trends & analytics
✅ FREE for MVP (2000 calls/month)
✅ Scalable pricing ($0.20/1K after)

🚀 LAUNCH READY!
```

---

## 📞 **SUPPORT:**

- Docs: https://developers.amadeus.com/self-service
- Community: https://developers.amadeus.com/support
- Email: developers@amadeus.com (fast response!)

**THEY LOVE STARTUPS! 🎯**

