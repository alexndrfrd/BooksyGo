import { NextRequest, NextResponse } from 'next/server';
import { getFlightInspirationSearch } from '@/lib/amadeus-api';

/**
 * API Route: Get 60-day price calendar
 * KILLER FEATURE - Shows best prices for next 60 days!
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get('origin') || 'OTP';
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const oneWay = searchParams.get('oneWay') === 'true';
    const duration = searchParams.get('duration'); // Trip duration in days
    const maxPrice = searchParams.get('maxPrice');

    console.log('📅 Fetching price calendar:', {
      origin,
      destination,
      departureDate,
      oneWay,
      duration,
      maxPrice,
    });

    // Check if we have API key
    if (!process.env.AMADEUS_API_KEY) {
      console.warn('⚠️  No Amadeus API key found, using mock calendar data');
      return NextResponse.json({
        success: true,
        source: 'mock',
        data: getMockCalendar(origin, destination),
      });
    }

    // Call Amadeus Flight Inspiration Search API
    const calendarResponse = await getFlightInspirationSearch({
      origin,
      destination: destination || undefined,
      departureDate: departureDate || undefined,
      oneWay,
      duration,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      viewBy: 'DATE', // Group by date for calendar view
    });

    console.log(`✅ Found ${calendarResponse.data?.length || 0} dates with prices`);

    // Transform data for calendar view
    const calendarData = calendarResponse.data?.map((item: any) => ({
      departureDate: item.departureDate,
      returnDate: item.returnDate,
      price: parseFloat(item.price?.total || '0'),
      currency: 'EUR',
      origin: item.origin,
      destination: item.destination,
      links: item.links,
    })) || [];

    // Sort by price (cheapest first)
    calendarData.sort((a: any, b: any) => a.price - b.price);

    // Find cheapest date
    const cheapest = calendarData[0];

    return NextResponse.json({
      success: true,
      source: 'amadeus',
      data: calendarData,
      meta: {
        total: calendarData.length,
        currency: 'EUR',
        cheapestDate: cheapest?.departureDate,
        cheapestPrice: cheapest?.price,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching calendar from Amadeus:', error);
    
    // Fallback to mock data
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get('origin') || 'OTP';
    const destination = searchParams.get('destination');
    
    return NextResponse.json({
      success: true,
      source: 'mock-fallback',
      data: getMockCalendar(origin, destination),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Mock calendar data fallback
function getMockCalendar(origin: string, destination: string | null) {
  const today = new Date();
  const calendar = [];

  // Generate 60 days of mock prices
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Generate random-ish prices (lower for mid-week, higher for weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const basePrice = isWeekend ? 120 : 70;
    const variation = Math.random() * 50;
    const price = Math.round(basePrice + variation);

    calendar.push({
      departureDate: date.toISOString().split('T')[0],
      returnDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price,
      currency: 'EUR',
      origin,
      destination: destination || 'BUD',
    });
  }

  // Sort by price
  calendar.sort((a, b) => a.price - b.price);

  return calendar;
}

