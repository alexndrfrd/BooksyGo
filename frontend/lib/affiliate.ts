/**
 * Affiliate Link Generator
 * Handles affiliate tracking for Skyscanner and Booking.com
 */

// Skyscanner Affiliate Configuration
const SKYSCANNER_AFFILIATE_ID = process.env.NEXT_PUBLIC_SKYSCANNER_AFFILIATE_ID || 'booksygo';
const SKYSCANNER_BASE_URL = 'https://www.skyscanner.com';

// Booking.com Affiliate Configuration
const BOOKING_COM_PARTNER_ID = process.env.NEXT_PUBLIC_BOOKING_COM_PARTNER_ID || 'booksygo';
const BOOKING_COM_BASE_URL = 'https://www.booking.com';

/**
 * Generate Skyscanner affiliate link for flights
 */
export function generateSkyscannerLink(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  cabinClass?: 'economy' | 'premiumeconomy' | 'business' | 'first';
}): string {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    cabinClass = 'economy',
  } = params;

  // Format: https://www.skyscanner.com/transport/flights/origin/destination/date1/date2/?adults=1&children=0&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&associateid=AFFILIATE_ID
  
  const searchParams = new URLSearchParams({
    adults: adults.toString(),
    children: children.toString(),
    cabinclass: cabinClass,
    rtn: returnDate ? '1' : '0',
    preferdirects: 'false',
    outboundaltsenabled: 'false',
    inboundaltsenabled: 'false',
    associateid: SKYSCANNER_AFFILIATE_ID,
  });

  const dates = returnDate 
    ? `${departureDate}/${returnDate}`
    : departureDate;

  return `${SKYSCANNER_BASE_URL}/transport/flights/${origin}/${destination}/${dates}/?${searchParams.toString()}`;
}

/**
 * Generate Booking.com affiliate link for hotels
 */
export function generateBookingComLink(params: {
  destination: string; // city name or destination ID
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults?: number;
  children?: number;
  rooms?: number;
  destId?: string; // Booking.com destination ID (optional, for better accuracy)
}): string {
  const {
    destination,
    checkIn,
    checkOut,
    adults = 2,
    children = 0,
    rooms = 1,
    destId,
  } = params;

  // Format: https://www.booking.com/searchresults.html?ss=Budapest&checkin=2025-11-15&checkout=2025-11-17&group_adults=2&group_children=0&no_rooms=1&aid=PARTNER_ID
  
  const searchParams = new URLSearchParams({
    ss: destination,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: adults.toString(),
    group_children: children.toString(),
    no_rooms: rooms.toString(),
    aid: BOOKING_COM_PARTNER_ID,
  });

  if (destId) {
    searchParams.append('dest_id', destId);
    searchParams.append('dest_type', 'city');
  }

  return `${BOOKING_COM_BASE_URL}/searchresults.html?${searchParams.toString()}`;
}

/**
 * Track affiliate click (for analytics)
 */
export async function trackAffiliateClick(data: {
  provider: 'skyscanner' | 'booking.com';
  userId?: string;
  searchParams: Record<string, any>;
  destinationUrl: string;
}): Promise<void> {
  try {
    await fetch('/api/analytics/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to track affiliate click:', error);
    // Don't block user navigation on tracking failure
  }
}

/**
 * Generate deep link for specific flight
 */
export function generateFlightDeepLink(flight: {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  airline: string;
  price: number;
  currency: string;
}): string {
  // In a real implementation, this would use Skyscanner's deep link API
  // For now, we'll generate a standard search link
  return generateSkyscannerLink({
    origin: flight.origin,
    destination: flight.destination,
    departureDate: flight.departureDate,
  });
}

/**
 * Generate deep link for specific hotel
 */
export function generateHotelDeepLink(hotel: {
  id: string;
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  price: number;
  currency: string;
}): string {
  // In a real implementation, this would use Booking.com's deep link API
  // For now, we'll generate a standard search link
  return generateBookingComLink({
    destination: hotel.location,
    checkIn: hotel.checkIn,
    checkOut: hotel.checkOut,
  });
}

