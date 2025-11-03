'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Star, 
  Users, 
  Check,
  ChevronLeft,
  Heart,
  Share2,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  destination: string;
  country: string;
  duration: number;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  category: 'beach' | 'city' | 'adventure' | 'luxury' | 'cultural' | 'romantic';
  image: string;
  includes: string[];
  highlights: string[];
  description: string;
  featured: boolean;
  bestSeller: boolean;
}

// Mock Packages Data
const MOCK_PACKAGES: PackageItem[] = [
  {
    id: '1',
    name: 'Santorini Sunset Romance',
    destination: 'Santorini',
    country: 'Grecia',
    duration: 5,
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.9,
    reviewCount: 342,
    category: 'romantic',
    image: '/hero-airplane.jpg',
    includes: [
      '✈️ Zbor dus-întors',
      '🏨 5 nopți hotel 5* cu mic dejun',
      '⛵ Croazieră la apus de soare',
      '🍷 Degustare de vinuri locale',
      '📸 Sesiune foto profesională',
      '🚗 Transfer aeroport-hotel'
    ],
    highlights: [
      'Vedere la Marea Egee',
      'Cină romantică pe plajă',
      'Excursie la Oia',
      'SPA & Wellness inclus'
    ],
    description: 'Trăiește magia Santorini-ului într-un pachet romantic all-inclusive',
    featured: true,
    bestSeller: true
  },
  {
    id: '2',
    name: 'Paris City Break Complet',
    destination: 'Paris',
    country: 'Franța',
    duration: 4,
    price: 649,
    originalPrice: 899,
    discount: 28,
    rating: 4.8,
    reviewCount: 567,
    category: 'city',
    image: '/hero-airplane.jpg',
    includes: [
      '✈️ Zbor dus-întors',
      '🏨 4 nopți hotel 4* central',
      '🎭 Bilete Turnul Eiffel + Louvre',
      '🥐 Mic dejun parizian',
      '🚇 Paris Museum Pass 4 zile',
      '📱 Ghid digital interactiv'
    ],
    highlights: [
      'Hotel în Marais District',
      'Skip-the-line la atracții',
      'Croazieră pe Sena',
      'Vizită la Versailles'
    ],
    description: 'Descoperă orașul luminilor cu cel mai complet pachet turistic',
    featured: true,
    bestSeller: false
  },
  {
    id: '3',
    name: 'Maldive Paradise All-Inclusive',
    destination: 'Maldive',
    country: 'Maldive',
    duration: 7,
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    rating: 5.0,
    reviewCount: 189,
    category: 'luxury',
    image: '/hero-airplane.jpg',
    includes: [
      '✈️ Zbor business class',
      '🏝️ 7 nopți water villa 5*',
      '🍽️ All-Inclusive Premium',
      '🤿 Snorkeling & Diving',
      '💆 SPA treatments daily',
      '🚁 Transfer hidroavion'
    ],
    highlights: [
      'Villa privată pe apă',
      'Plajă privată',
      'Dive center PADI',
      'Cină sub stele'
    ],
    description: 'Paradisul tropical într-un pachet ultra-premium',
    featured: true,
    bestSeller: false
  },
  {
    id: '4',
    name: 'Barcelona Beach & Culture',
    destination: 'Barcelona',
    country: 'Spania',
    duration: 5,
    price: 549,
    originalPrice: 749,
    discount: 27,
    rating: 4.7,
    reviewCount: 423,
    category: 'beach',
    image: '/hero-airplane.jpg',
    includes: [
      '✈️ Zbor dus-întors',
      '🏨 5 nopți hotel pe plajă',
      '🎨 Bilete Sagrada Familia',
      '🏖️ Access beach club',
      '🍷 Tapas tour ghidat',
      '🚌 Barcelona Card 5 zile'
    ],
    highlights: [
      'Plaja Barceloneta',
      'Park Güell',
      'Las Ramblas',
      'Vederi Mediterana'
    ],
    description: 'Combină plaja cu cultura în cel mai vibrant oraș spaniol',
    featured: false,
    bestSeller: true
  },
  {
    id: '5',
    name: 'Dubai Luxury Experience',
    destination: 'Dubai',
    country: 'UAE',
    duration: 6,
    price: 1899,
    originalPrice: 2599,
    discount: 27,
    rating: 4.9,
    reviewCount: 276,
    category: 'luxury',
    image: '/hero-airplane.jpg',
    includes: [
      '✈️ Zbor business class',
      '🏨 6 nopți hotel 5* deluxe',
      '🏙️ Burj Khalifa top floor',
      '🏜️ Safari în desert + cină',
      '🛍️ Dubai Mall shopping tour',
      '🚗 Transfer cu șofer privat'
    ],
    highlights: [
      'Hotel cu vedere la Burj Khalifa',
      'Yacht private cruise',
      'Gold Souk experience',
      'Sky diving optional'
    ],
    description: 'Luxul oriental în cel mai spectaculos oraș din lume',
    featured: false,
    bestSeller: false
  },
  {
    id: '6',
    name: 'Alpi Swiss Winter Magic',
    destination: 'Zermatt',
    country: 'Elveția',
    duration: 5,
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    rating: 4.8,
    reviewCount: 198,
    category: 'adventure',
    image: '/hero-airplane.jpg',
    includes: [
      '✈️ Zbor dus-întors',
      '🏔️ 5 nopți chalet luxury',
      '⛷️ Ski pass Matterhorn',
      '🧘 Wellness & SPA',
      '🍫 Swiss chocolate tasting',
      '🚠 Toate transferurile'
    ],
    highlights: [
      'Vista Matterhorn',
      'Ski paradise',
      'Fondue dinner',
      'Glacier express'
    ],
    description: 'Magia iernii elvețiene într-un pachet complet',
    featured: false,
    bestSeller: true
  }
];

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageItem[]>([]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minDuration, setMinDuration] = useState<number>(1);
  const [maxDuration, setMaxDuration] = useState<number>(14);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'duration'>('price');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPackages(MOCK_PACKAGES);
      setFilteredPackages(MOCK_PACKAGES);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...packages];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(pkg => pkg.price <= maxPrice);

    // Duration filter
    filtered = filtered.filter(pkg => pkg.duration >= minDuration && pkg.duration <= maxDuration);

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'duration') return a.duration - b.duration;
      return 0;
    });

    setFilteredPackages(filtered);
  }, [packages, selectedCategory, maxPrice, minDuration, maxDuration, sortBy]);

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      beach: 'bg-blue-100 text-blue-800',
      city: 'bg-purple-100 text-purple-800',
      adventure: 'bg-green-100 text-green-800',
      luxury: 'bg-yellow-100 text-yellow-800',
      cultural: 'bg-orange-100 text-orange-800',
      romantic: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-muted-foreground">Căutăm cele mai bune pachete pentru tine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white mb-4 hover:bg-white/10"
            onClick={() => router.push('/')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Înapoi
          </Button>
          <h1 className="text-3xl font-bold mb-2">
            <Package className="w-8 h-8 inline mr-3" />
            Pachete Turistice
          </h1>
          <p className="text-white/80">
            Am găsit {filteredPackages.length} pachete pentru tine
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categorie</label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Toate</option>
                    <option value="beach">Plajă</option>
                    <option value="city">City Break</option>
                    <option value="adventure">Aventură</option>
                    <option value="luxury">Luxury</option>
                    <option value="cultural">Cultural</option>
                    <option value="romantic">Romantic</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Preț maxim: €{maxPrice}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Durată (zile)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="14"
                      value={minDuration}
                      onChange={(e) => setMinDuration(Number(e.target.value))}
                      placeholder="Min"
                    />
                    <Input
                      type="number"
                      min="1"
                      max="14"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(Number(e.target.value))}
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    Sortare
                  </label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="price">Preț crescător</option>
                    <option value="rating">Rating</option>
                    <option value="duration">Durată</option>
                  </select>
                </div>

                <Button className="w-full" onClick={() => {
                  setSelectedCategory('all');
                  setMaxPrice(5000);
                  setMinDuration(1);
                  setMaxDuration(14);
                }}>
                  Resetează filtre
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3 space-y-6">
            {filteredPackages.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Niciun pachet găsit</h3>
                <p className="text-muted-foreground mb-4">
                  Încearcă să ajustezi filtrele pentru mai multe rezultate
                </p>
                <Button onClick={() => {
                  setSelectedCategory('all');
                  setMaxPrice(5000);
                }}>
                  Resetează filtrele
                </Button>
              </Card>
            ) : (
              filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto bg-gray-200">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${pkg.image})` }}
                      />
                      {pkg.featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {pkg.bestSeller && (
                        <Badge className="absolute top-3 right-3 bg-green-500">
                          🔥 Best Seller
                        </Badge>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className={getCategoryBadgeColor(pkg.category)}>
                            {pkg.category}
                          </Badge>
                          <h3 className="text-2xl font-bold mt-2">{pkg.name}</h3>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {pkg.destination}, {pkg.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{pkg.rating}</span>
                          <span className="text-muted-foreground text-sm">({pkg.reviewCount})</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{pkg.description}</p>

                      {/* Includes */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {pkg.includes.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="text-sm flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                            {item}
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="outline">
                            ✨ {highlight}
                          </Badge>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {pkg.duration} zile / {pkg.duration - 1} nopți
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground line-through">
                              €{pkg.originalPrice}
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              €{pkg.price}
                              <span className="text-sm font-normal text-muted-foreground">/pers</span>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Economisești {pkg.discount}%
                            </div>
                          </div>
                          <Button 
                            size="lg" 
                            className="ml-4"
                            onClick={() => router.push(`/packages/${pkg.id}`)}
                          >
                            Vezi detalii
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

