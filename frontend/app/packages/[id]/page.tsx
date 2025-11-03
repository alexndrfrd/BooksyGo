'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  Check,
  Sparkles,
  Clock,
  Shield,
  Phone,
  Mail,
  Image as ImageIcon,
  CreditCard
} from 'lucide-react';
import { createPackageCheckout, redirectToCheckout } from '@/lib/stripe';

interface PackageDetails {
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
  category: string;
  images: string[];
  includes: string[];
  highlights: string[];
  description: string;
  detailedDescription: string;
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  reviews: {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
  }[];
  cancellationPolicy: string;
  thingsToKnow: string[];
}

// Mock Package Details (in a real app, this would come from API)
const MOCK_PACKAGE_DETAILS: PackageDetails = {
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
  images: [
    '/hero-airplane.jpg',
    '/hero-airplane.jpg',
    '/hero-airplane.jpg',
    '/hero-airplane.jpg'
  ],
  includes: [
    '✈️ Zbor dus-întors (inclusiv bagaj de mână și cală)',
    '🏨 5 nopți cazare hotel 5* cu vedere la mare',
    '🍳 Mic dejun grecesc zilnic',
    '⛵ Croazieră privată la apus de soare',
    '🍷 Degustare de vinuri locale în cramă tradițională',
    '📸 Sesiune foto profesională (2 ore)',
    '🚗 Toate transferurile (aeroport-hotel-aeroport)',
    '🎫 Intrare gratuită la muzeele locale',
    '📱 SIM card local cu internet nelimitat',
    '🗺️ Ghid turistic digital interactiv'
  ],
  highlights: [
    'Vedere spectaculoasă la Marea Egee din camera ta',
    'Cină romantică pe plaja privată a hotelului',
    'Excursie la Oia pentru cele mai frumoase apusuri',
    'Acces la SPA & Wellness center (masaj inclus)',
    'Vizită la Red Beach și Black Beach',
    'Degustare de specialități locale (fava, tomatokeftedes)',
    'Asistență în limba română 24/7'
  ],
  description: 'Trăiește magia Santorini-ului într-un pachet romantic all-inclusive',
  detailedDescription: 
    'Santorini este una dintre cele mai romantice destinații din lume, cunoscută pentru apusurile spectaculoase, ' +
    'casele albe cu acoperișuri albastre și vinurile excelente. Acest pachet a fost creat special pentru cupluri ' +
    'care vor să trăiască o experiență de neuitat în insula grecească. ' +
    '\n\nHotelul nostru partener oferă camere luxoase cu vedere la mare, piscină infinită și servicii de 5 stele. ' +
    'Vei avea parte de mic dejun grecesc autentic în fiecare dimineață și acces la toate facilitățile hotelului. ' +
    '\n\nCroaziera la apus de soare este experiența care va rămâne în inima ta pentru totdeauna - un moment magic ' +
    'pe apele Mării Egee, cu un pahar de vin local și vederi de vis.',
  itinerary: [
    {
      day: 1,
      title: 'Sosire în Santorini',
      description: 'Bun venit pe cea mai romantică insulă din Grecia!',
      activities: [
        'Transfer de la aeroport la hotel cu mașină privată',
        'Check-in la hotel și primire cu băutură de bun venit',
        'Timp liber pentru relaxare pe plajă sau la piscină',
        'Cină romantică de întâmpinare la restaurantul hotelului'
      ]
    },
    {
      day: 2,
      title: 'Explorare Oia & Apus de Soare',
      description: 'Cea mai frumoasă zi din vacanță',
      activities: [
        'Mic dejun grecesc la hotel',
        'Excursie ghidată la Oia (satele tradiționale)',
        'Shopping în boutique-urile locale',
        'Croazieră privată la apus de soare cu vin local',
        'Cină în Oia cu vedere la caldera'
      ]
    },
    {
      day: 3,
      title: 'Degustare de Vinuri & Plaje',
      description: 'Descoperă vinurile unice ale Santorini-ului',
      activities: [
        'Vizită la cramă tradițională cu degustare',
        'Plajă la Red Beach (plajă cu nisip roșu vulcanic)',
        'Prânz la taverna locală',
        'Sesiune foto profesională pe plajă',
        'Masaj de cuplu la SPA-ul hotelului'
      ]
    },
    {
      day: 4,
      title: 'Zi Liberă - Relaxare',
      description: 'Bucură-te de hotel și facilitățile sale',
      activities: [
        'Mic dejun târziu la hotel',
        'Piscină infinită și plajă privată',
        'Optional: excursie cu ATV-ul pe insulă',
        'Cină romantică pe plajă cu muzică live'
      ]
    },
    {
      day: 5,
      title: 'Plecare',
      description: 'La revedere, Santorini!',
      activities: [
        'Mic dejun de rămas bun',
        'Ultimele poze și cumpărături de suveniruri',
        'Check-out și transfer la aeroport',
        'Zbor de întoarcere acasă cu amintiri de neuitat'
      ]
    }
  ],
  reviews: [
    {
      id: '1',
      userName: 'Maria & Andrei',
      rating: 5,
      date: '2 săptămâni în urmă',
      comment: 'A fost cea mai frumoasă vacanță din viața noastră! Totul a fost perfect - hotelul, excursiile, mâncarea. Croaziera la apus de soare a fost de vis. Recomandăm cu încredere!'
    },
    {
      id: '2',
      userName: 'Elena P.',
      rating: 5,
      date: '1 lună în urmă',
      comment: 'Organizare impecabilă, ghidul a fost foarte profesionist și prietenos. Hotelul depășește așteptările - camere spațioase, curățenie ireproșabilă. Vinurile de la degustare - delicioase!'
    },
    {
      id: '3',
      userName: 'Cristian & Ioana',
      rating: 4,
      date: '2 luni în urmă',
      comment: 'Super experiență! Singura problemă a fost că 5 zile par prea puține pentru atâtea lucruri de văzut. Vom reveni sigur! Mulțumim echipei BooksyGo pentru tot.'
    }
  ],
  cancellationPolicy: 
    'Anulare gratuită cu până la 14 zile înainte de plecare. ' +
    'Anulare cu 7-14 zile - rambursare 50%. ' +
    'Anulare cu mai puțin de 7 zile - fără rambursare.',
  thingsToKnow: [
    'Pasaport valabil minim 6 luni după data plecării',
    'Nu sunt necesare vaccinuri speciale',
    'Moneda: Euro (EUR)',
    'Limba: Greacă (engleza este vorbită pe scară largă)',
    'Vreme: temperatura medie 25-30°C în sezon',
    'Fus orar: +1 oră față de România'
  ]
};

export default function PackageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState<PackageDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingGuests, setBookingGuests] = useState(2);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPackageData(MOCK_PACKAGE_DETAILS);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleBookPackage = async () => {
    if (!packageData) return;

    setIsBooking(true);
    try {
      // Create Stripe checkout session
      const session = await createPackageCheckout({
        packageId: packageData.id,
        packageName: packageData.name,
        price: totalPrice,
        currency: 'eur',
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(Date.now() + packageData.duration * 24 * 60 * 60 * 1000).toISOString(),
        guests: bookingGuests,
      });

      // Redirect to Stripe Checkout
      await redirectToCheckout(session.sessionId);
    } catch (error) {
      console.error('Booking error:', error);
      alert('A apărut o eroare la procesarea plății. Vă rugăm să încercați din nou.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading || !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-muted-foreground">Încărcăm detaliile pachetului...</p>
        </div>
      </div>
    );
  }

  const totalPrice = packageData.price * bookingGuests;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => router.push('/packages')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Înapoi la pachete
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all"
                  style={{ backgroundImage: `url(${packageData.images[selectedImage]})` }}
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {packageData.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-white scale-110' : 'border-transparent opacity-70'
                      }`}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Title & Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">{packageData.category}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{packageData.name}</h1>
                  <p className="text-lg text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {packageData.destination}, {packageData.country}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{packageData.rating}</span>
                  <span className="text-muted-foreground">({packageData.reviewCount} recenzii)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>{packageData.duration} zile / {packageData.duration - 1} nopți</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Despre acest pachet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground whitespace-pre-line">
                  {packageData.detailedDescription}
                </p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packageData.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Includes */}
            <Card>
              <CardHeader>
                <CardTitle>Ce include pachetul?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packageData.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Itinerariu detaliat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {packageData.itinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-primary pl-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Ziua {day.day}</Badge>
                      <h3 className="font-bold">{day.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                    <ul className="space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  Recenzii ({packageData.reviewCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {packageData.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Things to Know */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Informații importante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Politică de anulare</h4>
                  <p className="text-sm text-muted-foreground">{packageData.cancellationPolicy}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Ce trebuie să știi</h4>
                  <ul className="space-y-2">
                    {packageData.thingsToKnow.map((thing, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {thing}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Rezervă acum</CardTitle>
                <CardDescription>Îți garantăm prețul cel mai bun!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="border-b pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">€{packageData.price}</span>
                    <span className="text-sm text-muted-foreground">/persoană</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="line-through text-muted-foreground">€{packageData.originalPrice}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      -{packageData.discount}%
                    </Badge>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Număr persoane</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(Number(e.target.value))}
                  />
                </div>

                {/* Total Price */}
                <div className="border-t border-b py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Preț per persoană</span>
                    <span className="font-medium">€{packageData.price}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Persoane</span>
                    <span className="font-medium">×{bookingGuests}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">€{totalPrice}</span>
                  </div>
                </div>

                {/* Booking Button */}
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleBookPackage}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesare...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Rezervă acum
                    </>
                  )}
                </Button>

                {/* Features */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Confirmare instantanee
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Anulare gratuită până la 14 zile
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Plată securizată
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Asistență 24/7 în română
                  </div>
                </div>

                {/* Contact */}
                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm font-medium">Ai întrebări?</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+40 123 456 789</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>support@booksygo.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

