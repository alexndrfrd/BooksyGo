import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/skyscanner-api';

/**
 * API Route: Search flights using Skyscanner API
 * This replaces the mock flight data with REAL data from Skyscanner
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get('origin') || 'OTP';
    const destination = searchParams.get('destination') || 'BUD';
    const date = searchParams.get('date') || '2025-11-15';
    const returnDate = searchParams.get('returnDate');
    const adults = parseInt(searchParams.get('adults') || '1');
    const cabinClass = (searchParams.get('cabinClass') || 'economy') as
      | 'economy'
      | 'premium_economy'
      | 'business'
      | 'first';

    console.log('🔍 Searching flights:', {
      origin,
      destination,
      date,
      returnDate,
      adults,
      cabinClass,
    });

    // Check if we have API key
    if (!process.env.SKYSCANNER_API_KEY) {
      console.warn('⚠️ No Skyscanner API key found, using mock data');
      return NextResponse.json({
        success: true,
        source: 'mock',
        data: getMockFlights(origin, destination, date),
      });
    }

    // Call Skyscanner API
    const flights = await searchFlights({
      originSkyId: origin,
      destinationSkyId: destination,
      departureDate: date,
      returnDate,
      adults,
      cabinClass,
      currency: 'EUR',
      locale: 'ro-RO',
      market: 'RO',
    });

    console.log(`✅ Found ${flights.length} flights from Skyscanner`);

    // Transform to our internal format
    const transformedFlights = flights.map((flight) => ({
      id: flight.id,
      airline: flight.legs[0].carriers[0]?.name || 'Unknown',
      flightNumber: flight.id.substring(0, 8),
      departure: {
        airport: flight.legs[0].origin.displayCode,
        city: flight.legs[0].origin.name,
        time: new Date(flight.legs[0].departure).toLocaleTimeString('ro-RO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: date,
      },
      arrival: {
        airport: flight.legs[0].destination.displayCode,
        city: flight.legs[0].destination.name,
        time: new Date(flight.legs[0].arrival).toLocaleTimeString('ro-RO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: date,
      },
      duration: `${Math.floor(flight.legs[0].duration / 60)}h ${
        flight.legs[0].duration % 60
      }m`,
      stops: flight.legs[0].stops,
      price: flight.price.amount,
      currency: flight.price.currency,
      availableSeats: Math.floor(Math.random() * 20) + 1, // Skyscanner doesn't provide this
      cabinClass: cabinClass.replace('_', ' '),
      aircraft: 'Various', // Skyscanner doesn't always provide this
      deepLink: flight.deepLink, // Affiliate link
    }));

    return NextResponse.json({
      success: true,
      source: 'skyscanner',
      data: {
        flights: transformedFlights,
        search: {
          origin,
          destination,
          date,
          passengers: adults,
          type: 'flights',
        },
        meta: {
          total: transformedFlights.length,
          currency: 'EUR',
          searchId: `search_${Date.now()}`,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error searching flights:', error);

    // Fallback to mock data if API fails
    const searchParams = req.nextUrl.searchParams;
    const origin = searchParams.get('origin') || 'OTP';
    const destination = searchParams.get('destination') || 'BUD';
    const date = searchParams.get('date') || '2025-11-15';

    return NextResponse.json({
      success: true,
      source: 'mock_fallback',
      error: 'API temporarily unavailable',
      data: getMockFlights(origin, destination, date),
    });
  }
}

// Mock data fallback
function getMockFlights(origin: string, destination: string, date: string) {
  const MOCK_FLIGHTS = [
    {
      id: '1',
      airline: 'Wizz Air',
      flightNumber: 'W6 1234',
      departure: {
        airport: origin,
        city: 'Bucharest',
        time: '08:00',
        date: date,
      },
      arrival: {
        airport: destination,
        city: 'Budapest',
        time: '08:50',
        date: date,
      },
      duration: '1h 50m',
      stops: 0,
      price: 45.99,
      currency: 'EUR',
      availableSeats: 12,
      cabinClass: 'Economy',
      aircraft: 'Airbus A320',
    },
    {
      id: '2',
      airline: 'Ryanair',
      flightNumber: 'FR 9876',
      departure: {
        airport: origin,
        city: 'Bucharest',
        time: '10:30',
        date: date,
      },
      arrival: {
        airport: destination,
        city: 'Budapest',
        time: '11:25',
        date: date,
      },
      duration: '1h 55m',
      stops: 0,
      price: 39.99,
      currency: 'EUR',
      availableSeats: 23,
      cabinClass: 'Economy',
      aircraft: 'Boeing 737',
    },
    {
      id: '3',
      airline: 'Tarom',
      flightNumber: 'RO 5678',
      departure: {
        airport: origin,
        city: 'Bucharest',
        time: '14:15',
        date: date,
      },
      arrival: {
        airport: destination,
        city: 'Budapest',
        time: '15:10',
        date: date,
      },
      duration: '1h 55m',
      stops: 0,
      price: 89.99,
      currency: 'EUR',
      availableSeats: 8,
      cabinClass: 'Economy',
      aircraft: 'Boeing 737',
    },
  ];

  return {
    flights: MOCK_FLIGHTS,
    search: {
      origin,
      destination,
      date,
      passengers: 1,
      type: 'flights',
    },
    meta: {
      total: MOCK_FLIGHTS.length,
      currency: 'EUR',
      searchId: `mock_${Date.now()}`,
    },
  };
}

