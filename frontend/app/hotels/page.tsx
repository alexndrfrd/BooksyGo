'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
  Home,
  Users,
  Calendar,
  Euro,
  CheckCircle,
  X
} from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  currency: string;
  image: string;
  amenities: string[];
  location: string;
  distance: string;
  stars: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  description: string;
}

interface SearchResponse {
  success: boolean;
  data: {
    hotels: Hotel[];
    search: {
      destination: string;
      checkIn: string;
      checkOut: string;
      guests: number;
    };
    meta: {
      total: number;
      currency: string;
    };
  };
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Breakfast': Coffee,
  'Parking': Car,
  'Pool': Waves,
  'Gym': Dumbbell,
  'Restaurant': Utensils,
  'Kitchen': Home,
  'Air Conditioning': null,
  'Spa': null,
  'Bar': null,
  'City View': null,
  'Washing Machine': null,
  'Common Area': null,
  'Lockers': null
};

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('rating');

  const destination = searchParams.get('destination') || 'Budapest';
  const checkIn = searchParams.get('checkIn') || '2025-11-15';
  const checkOut = searchParams.get('checkOut') || '2025-11-17';
  const guests = parseInt(searchParams.get('guests') || '2');

  const handleBookHotel = (hotel: Hotel) => {
    const hotelData = encodeURIComponent(JSON.stringify(hotel));
    router.push(`/booking/hotel?hotel=${hotelData}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/search?type=hotels&destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
        );
        const data: SearchResponse = await response.json();

        if (data.success) {
          let sortedHotels = [...data.data.hotels];
          if (sortBy === 'price') {
            sortedHotels.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'rating') {
            sortedHotels.sort((a, b) => b.rating - a.rating);
          } else if (sortBy === 'distance') {
            sortedHotels.sort((a, b) => {
              const distA = parseFloat(a.distance.split(' ')[0]);
              const distB = parseFloat(b.distance.split(' ')[0]);
              return distA - distB;
            });
          }
          setHotels(sortedHotels);
        } else {
          setError('Failed to fetch hotels');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, checkIn, checkOut, guests, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderAmenityIcon = (amenity: string) => {
    const Icon = amenityIcons[amenity];
    if (!Icon) return null;
    return <Icon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Căutăm cele mai bune hoteluri...</h2>
            <p className="text-muted-foreground">Analizăm oferte din peste 1000 hoteluri</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Eroare la căutare</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.history.back()} className="mt-4">
              Înapoi la căutare
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Hoteluri în {destination}
              </h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(checkIn).toLocaleDateString('ro-RO')} - {new Date(checkOut).toLocaleDateString('ro-RO')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{guests} oaspeți</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Găsit</p>
              <p className="text-2xl font-bold">{hotels.length} hoteluri</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Summary */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nopți</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Sortare: Rating</option>
                <option value="price">Sortare: Preț</option>
                <option value="distance">Sortare: Distanță</option>
              </select>
              <Button variant="outline" onClick={() => window.history.back()}>
                Modifică căutarea
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                {/* Hotel Image */}
                <div className="w-80 h-48 bg-gray-200 flex items-center justify-center relative">
                  <div className="text-gray-500 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Imagine hotel</p>
                  </div>
                  {hotel.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      -{hotel.discount}%
                    </Badge>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: hotel.stars }, (_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(hotel.rating)}
                          <span className="text-sm font-medium ml-1">{hotel.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({hotel.reviewCount} review-uri)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.location}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {hotel.description}
                      </p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 6).map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full"
                          >
                            {renderAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {hotel.amenities.length > 6 && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            +{hotel.amenities.length - 6} mai multe
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex gap-4 text-sm">
                        {hotel.freeCancellation && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Anulare gratuită</span>
                          </div>
                        )}
                        {hotel.breakfastIncluded && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Micul dejun inclus</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right ml-6">
                      <div className="mb-2">
                        {hotel.originalPrice > hotel.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            €{hotel.originalPrice}
                          </div>
                        )}
                        <div className="text-3xl font-bold text-primary">
                          €{hotel.price}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per noapte
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground mb-4">
                        Preț pentru {guests} oaspeți
                      </div>

                      <Button size="lg" className="w-full" onClick={() => handleBookHotel(hotel)}>
                        Rezervă acum
                      </Button>

                      <div className="text-xs text-muted-foreground mt-2">
                        Anulare gratuită până la 24h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hotels.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Niciun hotel găsit</h3>
            <p className="text-muted-foreground mb-4">
              Nu am găsit hoteluri pentru această destinație. Încearcă să modifici datele.
            </p>
            <Button onClick={() => window.history.back()}>
              Modifică căutarea
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
