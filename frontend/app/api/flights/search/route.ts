import { NextRequest, NextResponse } from 'next/server';
import { searchFlights as searchAmadeusFlights, transformAmadeusFlightData } from '@/lib/amadeus-api';

/**
 * API Route: Search flights using Amadeus API
 * This replaces the mock flight data with REAL data from Amadeus
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get('origin') || 'OTP';
    const destination = searchParams.get('destination') || 'BUD';
    const date = searchParams.get('date') || '2025-12-15';
    const returnDate = searchParams.get('returnDate');
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const cabinClass = (searchParams.get('cabinClass') || 'ECONOMY') as
      | 'ECONOMY'
      | 'PREMIUM_ECONOMY'
      | 'BUSINESS'
      | 'FIRST';

    console.log('✈️  Searching flights with Amadeus:', {
      origin,
      destination,
      date,
      returnDate,
      adults,
      children,
      cabinClass,
    });

    // Check if we have API key
    if (!process.env.AMADEUS_API_KEY) {
      console.warn('⚠️  No Amadeus API key found, using mock data');
    return NextResponse.json({
      success: true,
      source: 'mock',
      data: {
        flights: getMockFlights(origin, destination, date),
        search: {
          origin,
          destination,
          date,
          passengers: adults,
          type: 'one-way',
        },
        meta: {
          total: 4,
          currency: 'EUR',
          searchId: `mock-${origin}-${destination}-${date}`,
        },
      },
    });
    }

    // Call Amadeus API
    const amadeusResponse = await searchAmadeusFlights({
      origin,
      destination,
      departureDate: date,
      returnDate: returnDate || undefined,
      adults,
      children: children > 0 ? children : undefined,
      cabinClass,
    });

    console.log(`✅ Found ${amadeusResponse.data?.length || 0} flights from Amadeus`);

    // Transform Amadeus data to our format
    const flights = transformAmadeusFlightData(amadeusResponse);

    return NextResponse.json({
      success: true,
      source: 'amadeus',
      data: {
        flights: flights,
        search: {
          origin,
          destination,
          date,
          passengers: adults,
          type: 'one-way',
        },
        meta: {
          total: flights.length,
          currency: 'EUR',
          searchId: `${origin}-${destination}-${date}-${Date.now()}`,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error fetching flights from Amadeus:', error);
    
    // Fallback to mock data on error
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get('origin') || 'OTP';
    const destination = searchParams.get('destination') || 'BUD';
    const date = searchParams.get('date') || '2025-12-15';
    
    return NextResponse.json({
      success: true,
      source: 'mock-fallback',
      data: {
        flights: getMockFlights(origin, destination, date),
        search: {
          origin,
          destination,
          date,
          passengers: 1,
          type: 'one-way',
        },
        meta: {
          total: 4,
          currency: 'EUR',
          searchId: `fallback-${origin}-${destination}-${date}`,
        },
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Mock data fallback
function getMockFlights(origin: string, destination: string, date: string) {
  return [
    {
      id: '1',
      airline: 'W6',
      flightNumber: 'W6 2341',
      departure: {
        airport: origin,
        city: origin,
        time: '06:30',
        date: date,
      },
      arrival: {
        airport: destination,
        city: destination,
        time: '08:15',
        date: date,
      },
      duration: '1h 45m',
      stops: 0,
      price: 49.99,
      currency: 'EUR',
      availableSeats: 15,
      cabinClass: 'Economy',
      aircraft: 'Airbus A320',
    },
    {
      id: '2',
      airline: 'RO',
      flightNumber: 'RO 212',
      departure: {
        airport: origin,
        city: origin,
        time: '09:00',
        date: date,
      },
      arrival: {
        airport: destination,
        city: destination,
        time: '10:50',
        date: date,
      },
      duration: '1h 50m',
      stops: 0,
      price: 79.99,
      currency: 'EUR',
      availableSeats: 8,
      cabinClass: 'Economy',
      aircraft: 'Boeing 737',
    },
    {
      id: '3',
      airline: 'FR',
      flightNumber: 'FR 8345',
      departure: {
        airport: origin,
        city: origin,
        time: '14:30',
        date: date,
      },
      arrival: {
        airport: destination,
        city: destination,
        time: '16:20',
        date: date,
      },
      duration: '1h 50m',
      stops: 0,
      price: 39.99,
      currency: 'EUR',
      availableSeats: 20,
      cabinClass: 'Economy',
      aircraft: 'Boeing 737-800',
    },
    {
      id: '4',
      airline: 'LH',
      flightNumber: 'LH 1678',
      departure: {
        airport: origin,
        city: origin,
        time: '12:15',
        date: date,
      },
      arrival: {
        airport: destination,
        city: destination,
        time: '14:25',
        date: date,
      },
      duration: '2h 10m',
      stops: 1,
      price: 124.99,
      currency: 'EUR',
      availableSeats: 5,
      cabinClass: 'Economy',
      aircraft: 'Airbus A320',
    },
  ];
}
