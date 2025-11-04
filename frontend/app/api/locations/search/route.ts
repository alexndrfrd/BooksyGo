import { NextRequest, NextResponse } from 'next/server';
import { searchAirports, getPopularAirports } from '@/lib/airports-search';

/**
 * API Route: Search for airports and cities (autocomplete)
 * Uses STATIC airport database (OpenFlights) - super fast, no API calls!
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    // Return popular airports if no query
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        source: 'static',
        data: getPopularAirports(10),
      });
    }

    console.log('🔍 Searching airports (static DB):', query);

    // Search in static database (instant!)
    const results = searchAirports(query, 15);

    console.log(`✅ Found ${results.length} airports`);

    return NextResponse.json({
      success: true,
      source: 'static',
      data: results,
    });
  } catch (error) {
    console.error('❌ Error searching airports:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

