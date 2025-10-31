import { NextRequest, NextResponse } from 'next/server';

// Mock flight data
const MOCK_FLIGHTS = [
  {
    id: '1',
    airline: 'Wizz Air',
    flightNumber: 'W6 2341',
    departure: {
      airport: 'OTP',
      city: 'Bucharest',
      time: '06:30',
      date: '2025-11-15'
    },
    arrival: {
      airport: 'BUD',
      city: 'Budapest',
      time: '08:15',
      date: '2025-11-15'
    },
    duration: '2h 45m',
    stops: 0,
    price: 49.99,
    currency: 'EUR',
    availableSeats: 15,
    cabinClass: 'Economy',
    aircraft: 'Airbus A320'
  },
  {
    id: '2',
    airline: 'Ryanair',
    flightNumber: 'FR 1234',
    departure: {
      airport: 'OTP',
      city: 'Bucharest',
      time: '14:20',
      date: '2025-11-15'
    },
    arrival: {
      airport: 'BUD',
      city: 'Budapest',
      time: '16:05',
      date: '2025-11-15'
    },
    duration: '2h 45m',
    stops: 0,
    price: 55.99,
    currency: 'EUR',
    availableSeats: 8,
    cabinClass: 'Economy',
    aircraft: 'Boeing 737'
  },
  {
    id: '3',
    airline: 'TAROM',
    flightNumber: 'RO 456',
    departure: {
      airport: 'OTP',
      city: 'Bucharest',
      time: '09:45',
      date: '2025-11-15'
    },
    arrival: {
      airport: 'BUD',
      city: 'Budapest',
      time: '11:35',
      date: '2025-11-15'
    },
    duration: '2h 50m',
    stops: 0,
    price: 89.99,
    currency: 'EUR',
    availableSeats: 22,
    cabinClass: 'Economy',
    aircraft: 'Boeing 737-800'
  },
  {
    id: '4',
    airline: 'Lufthansa',
    flightNumber: 'LH 1678',
    departure: {
      airport: 'OTP',
      city: 'Bucharest',
      time: '12:15',
      date: '2025-11-15'
    },
    arrival: {
      airport: 'BUD',
      city: 'Budapest',
      time: '14:05',
      date: '2025-11-15'
    },
    duration: '2h 50m',
    stops: 0,
    price: 124.99,
    currency: 'EUR',
    availableSeats: 5,
    cabinClass: 'Economy',
    aircraft: 'Airbus A320'
  },
  {
    id: '5',
    airline: 'Turkish Airlines',
    flightNumber: 'TK 1038',
    departure: {
      airport: 'OTP',
      city: 'Bucharest',
      time: '18:30',
      date: '2025-11-15'
    },
    arrival: {
      airport: 'BUD',
      city: 'Budapest',
      time: '20:20',
      date: '2025-11-15'
    },
    duration: '2h 50m',
    stops: 0,
    price: 156.99,
    currency: 'EUR',
    availableSeats: 12,
    cabinClass: 'Economy',
    aircraft: 'Boeing 737-800'
  }
];

// Mock hotel data
const MOCK_HOTELS = [
  {
    id: '1',
    name: 'Hotel Budapest Center',
    rating: 4.2,
    reviewCount: 1247,
    price: 85,
    originalPrice: 110,
    discount: 23,
    currency: 'EUR',
    image: '/hotel-placeholder.jpg',
    amenities: ['WiFi', 'Breakfast', 'Parking', 'Pool', 'Air Conditioning'],
    location: 'City Center, 500m from center',
    distance: '0.5 km from city center',
    stars: 4,
    freeCancellation: true,
    breakfastIncluded: true,
    description: 'Hotel modern în inima Budapestei, perfect pentru turiști.'
  },
  {
    id: '2',
    name: 'Grand Hotel Thermal',
    rating: 4.5,
    reviewCount: 892,
    price: 120,
    originalPrice: 150,
    discount: 20,
    currency: 'EUR',
    image: '/hotel-placeholder.jpg',
    amenities: ['WiFi', 'Breakfast', 'Spa', 'Pool', 'Gym', 'Restaurant', 'Bar'],
    location: 'Thermal Area, 2km from center',
    distance: '2 km from city center',
    stars: 5,
    freeCancellation: true,
    breakfastIncluded: true,
    description: 'Luxury spa hotel cu piscine termale și wellness center.'
  },
  {
    id: '3',
    name: 'Budget Inn Budapest',
    rating: 3.8,
    reviewCount: 2156,
    price: 45,
    originalPrice: 55,
    discount: 18,
    currency: 'EUR',
    image: '/hotel-placeholder.jpg',
    amenities: ['WiFi', 'Breakfast', 'Air Conditioning'],
    location: 'Eastern District, 3km from center',
    distance: '3 km from city center',
    stars: 3,
    freeCancellation: true,
    breakfastIncluded: false,
    description: 'Opțiune bugetară curată și confortabilă pentru backpackeri.'
  },
  {
    id: '4',
    name: 'Castle View Boutique Hotel',
    rating: 4.7,
    reviewCount: 634,
    price: 95,
    originalPrice: 125,
    discount: 24,
    currency: 'EUR',
    image: '/hotel-placeholder.jpg',
    amenities: ['WiFi', 'Breakfast', 'Parking', 'Restaurant', 'City View'],
    location: 'Castle Hill, 1.2km from center',
    distance: '1.2 km from city center',
    stars: 4,
    freeCancellation: false,
    breakfastIncluded: true,
    description: 'Boutique hotel cu vedere panoramică asupra castelului.'
  },
  {
    id: '5',
    name: 'Riverside Apartments',
    rating: 4.3,
    reviewCount: 987,
    price: 75,
    originalPrice: 90,
    discount: 17,
    currency: 'EUR',
    image: '/hotel-placeholder.jpg',
    amenities: ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Washing Machine'],
    location: 'Pest Riverside, 800m from center',
    distance: '0.8 km from city center',
    stars: 4,
    freeCancellation: true,
    breakfastIncluded: false,
    description: 'Apartamente moderne cu bucătărie proprie, ideale pentru șederi lungi.'
  },
  {
    id: '6',
    name: 'Party Hostel Central',
    rating: 4.1,
    reviewCount: 3421,
    price: 25,
    originalPrice: 30,
    discount: 17,
    currency: 'EUR',
    image: '/hotel-placeholder.jpg',
    amenities: ['WiFi', 'Bar', 'Common Area', 'Lockers'],
    location: 'Jewish Quarter, 300m from center',
    distance: '0.3 km from city center',
    stars: 2,
    freeCancellation: true,
    breakfastIncluded: false,
    description: 'Hostel vibrant în zona cea mai animată a orașului.'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'flights';
  const origin = searchParams.get('origin') || 'OTP';
  const destination = searchParams.get('destination') || 'BUD';
  const date = searchParams.get('date') || '2025-11-15';

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  if (type === 'flights') {
    // Filter flights by destination (simple mock logic)
    const filteredFlights = MOCK_FLIGHTS.filter(flight =>
      flight.arrival.airport === destination.toUpperCase()
    );

    return NextResponse.json({
      success: true,
      data: {
        flights: filteredFlights,
        search: {
          origin,
          destination,
          date,
          passengers: 1,
          type: 'one-way'
        },
        meta: {
          total: filteredFlights.length,
          currency: 'EUR',
          searchId: `search_${Date.now()}`
        }
      }
    });
  } else if (type === 'hotels') {
    return NextResponse.json({
      success: true,
      data: {
        hotels: MOCK_HOTELS,
        search: {
          destination,
          checkIn: date,
          checkOut: '2025-11-17',
          guests: 2
        },
        meta: {
          total: MOCK_HOTELS.length,
          currency: 'EUR'
        }
      }
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Invalid search type'
  }, { status: 400 });
}
