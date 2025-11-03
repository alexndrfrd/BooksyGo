'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Crown,
  Sparkles,
  Star,
  Check,
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Plane,
  Hotel,
  Heart,
  Shield,
  Clock,
  Award,
  MessageCircle
} from 'lucide-react';

interface PremiumPackage {
  id: string;
  name: string;
  destination: string;
  duration: number;
  price: number;
  image: string;
  category: 'luxury' | 'romantic' | 'adventure';
  includes: string[];
  featured: boolean;
}

const PREMIUM_PACKAGES: PremiumPackage[] = [
  {
    id: 'p1',
    name: 'Santorini Sunset Romance Deluxe',
    destination: 'Santorini, Grecia',
    duration: 7,
    price: 2499,
    image: '/hero-airplane.jpg',
    category: 'romantic',
    includes: [
      'Business class flights',
      'Villa cu piscină infinită privată',
      'Majordomo personal',
      'Yacht privat pentru 2 zile',
      'Michelin star dining',
      'Helicopter tour'
    ],
    featured: true
  },
  {
    id: 'p2',
    name: 'Maldives Ultra Luxury Escape',
    destination: 'Maldive',
    duration: 10,
    price: 4999,
    image: '/hero-airplane.jpg',
    category: 'luxury',
    includes: [
      'First class flights',
      'Overwater villa 500 m²',
      'Butler 24/7',
      'Seaplane transfers',
      'Unlimited spa treatments',
      'Private beach dining'
    ],
    featured: true
  },
  {
    id: 'p3',
    name: 'Swiss Alps Luxury Retreat',
    destination: 'Zermatt, Elveția',
    duration: 6,
    price: 3299,
    image: '/hero-airplane.jpg',
    category: 'adventure',
    includes: [
      'Business class flights',
      'Chalet de lux cu saună',
      'Private ski instructor',
      'Helicopter skiing',
      'Michelin dining',
      'Wellness spa access'
    ],
    featured: true
  },
  {
    id: 'p4',
    name: 'Dubai Royal Experience',
    destination: 'Dubai, UAE',
    duration: 5,
    price: 3899,
    image: '/hero-airplane.jpg',
    category: 'luxury',
    includes: [
      'Business class flights',
      'Burj Al Arab suite',
      'Rolls Royce transfers',
      'Desert safari private',
      'Yacht cruise',
      'Personal shopper'
    ],
    featured: false
  }
];

const PREMIUM_TIERS = [
  {
    name: 'Silver',
    icon: '🥈',
    price: 'Gratuit',
    features: [
      'Acces la pachete curate',
      'Reduceri până la 15%',
      'Priority customer support',
      'Early access la oferte',
      'Travel insurance inclus',
      'Flexible cancellation'
    ],
    color: 'from-gray-400 to-gray-600'
  },
  {
    name: 'Gold',
    icon: '🥇',
    price: '99€/an',
    features: [
      'Toate beneficiile Silver',
      'Reduceri până la 25%',
      'Airport lounge access',
      'Upgrade gratuit la hotel',
      'Concierge phone support',
      'Birthday special gift'
    ],
    color: 'from-yellow-400 to-yellow-600',
    popular: true
  },
  {
    name: 'Platinum',
    icon: '💎',
    price: '299€/an',
    features: [
      'Toate beneficiile Gold',
      'Reduceri până la 35%',
      'Personal travel advisor',
      'Private jet discounts',
      'Yacht charter access',
      'VIP experiences worldwide',
      'Custom itinerary planning'
    ],
    color: 'from-purple-500 to-indigo-600'
  }
];

export default function PremiumPage() {
  const router = useRouter();
  const [conciergeForm, setConciergeForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    budget: '',
    message: ''
  });

  const handleConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, send to API
    alert('✅ Mulțumim! Echipa noastră de concierge te va contacta în 24h!');
    setConciergeForm({
      name: '',
      email: '',
      phone: '',
      destination: '',
      budget: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(75, 17, 111, 0.8), rgba(75, 17, 111, 0.8)), url('/hero-airplane.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-black/50" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <Button
            variant="ghost"
            className="text-white mb-6 hover:bg-white/10"
            onClick={() => router.push('/')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Înapoi
          </Button>

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              <Crown className="w-4 h-4 mr-2" />
              BooksyGo PREMIUM
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Experiențe de <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Lux</span>
              <br />
              Călătorii de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Neuitat</span>
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Descoperă o lume de privilegii exclusive, experiențe curate manual 
              și servicii concierge dedicate călătoriilor tale de vis
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:scale-105 transition-transform shadow-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                Explorează Pachete Premium
              </Button>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary transition-all shadow-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Vorbește cu un Consultant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">De ce BooksyGo Premium?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transformăm călătoriile în experiențe memorabile prin atenție la detalii și servicii de nivel superior
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-yellow-500 transition-all">
              <CardHeader>
                <Award className="w-12 h-12 text-yellow-500 mb-2" />
                <CardTitle>Experiențe Curate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pachete selectate manual de experți în călătorii de lux
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-all">
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-500 mb-2" />
                <CardTitle>Concierge 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Asistent personal disponibil oricând pentru nevoile tale
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-pink-500 transition-all">
              <CardHeader>
                <Heart className="w-12 h-12 text-pink-500 mb-2" />
                <CardTitle>Personalizare Totală</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Itinerarii create special pentru preferințele tale unice
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all">
              <CardHeader>
                <Star className="w-12 h-12 text-blue-500 mb-2" />
                <CardTitle>Acces VIP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Experiențe exclusive și locații accesibile doar prin partenerii noștri
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Packages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Curated by Experts
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Pachete Premium Exclusive</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experiențe de lux create pentru cei care apreciază perfecțiunea în fiecare detaliu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {PREMIUM_PACKAGES.filter(pkg => pkg.featured).map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-2xl transition-all border-2 hover:border-yellow-500">
                <div className="relative h-64 bg-gray-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${pkg.image})` }}
                  />
                  <Badge className="absolute top-4 left-4 bg-yellow-500">
                    <Crown className="w-3 h-3 mr-1" />
                    PREMIUM
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4" />
                    {pkg.destination}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {pkg.duration} zile
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      2 persoane
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Ce include:</p>
                    <div className="space-y-1">
                      {pkg.includes.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground mt-2">+ {pkg.includes.length - 3} altele...</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-3xl font-bold text-yellow-600">€{pkg.price}</div>
                      <div className="text-xs text-muted-foreground">per persoană</div>
                    </div>
                    <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:scale-105 transition-transform">
                      Vezi Detalii
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" onClick={() => router.push('/packages')}>
              Vezi Toate Pachetele Premium
            </Button>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Alege Membership-ul Tău</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fiecare nivel vine cu beneficii exclusive adaptate stilului tău de călătorie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PREMIUM_TIERS.map((tier, idx) => (
              <Card
                key={idx}
                className={`relative overflow-hidden ${
                  tier.popular ? 'border-4 border-yellow-500 shadow-xl scale-105' : 'border-2'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{tier.icon}</div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold mt-2">{tier.price}</div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tier.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      tier.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                        : ''
                    }`}
                  >
                    {tier.price === 'Gratuit' ? 'Începe Acum' : 'Alege ' + tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Private Concierge Form */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-white/20 text-white mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Serviciu VIP
              </Badge>
              <h2 className="text-4xl font-bold mb-4">Private Concierge Service</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Consultanță personalizată pentru călătorii de lux. Echipa noastră de experți va crea itinerariul perfect pentru tine.
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <form onSubmit={handleConciergeSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nume complet *</label>
                      <Input
                        required
                        placeholder="John Doe"
                        value={conciergeForm.name}
                        onChange={(e) => setConciergeForm({ ...conciergeForm, name: e.target.value })}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={conciergeForm.email}
                        onChange={(e) => setConciergeForm({ ...conciergeForm, email: e.target.value })}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Telefon *</label>
                      <Input
                        required
                        placeholder="+40 123 456 789"
                        value={conciergeForm.phone}
                        onChange={(e) => setConciergeForm({ ...conciergeForm, phone: e.target.value })}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Destinație dorită</label>
                      <Input
                        placeholder="Ex: Maldive, Bora Bora"
                        value={conciergeForm.destination}
                        onChange={(e) => setConciergeForm({ ...conciergeForm, destination: e.target.value })}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Buget estimat (EUR)</label>
                    <Input
                      type="number"
                      placeholder="5000+"
                      value={conciergeForm.budget}
                      onChange={(e) => setConciergeForm({ ...conciergeForm, budget: e.target.value })}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Detalii călătorie *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Descrie-ne ce tip de experiență îți dorești, preferințe speciale, număr de persoane, perioada..."
                      value={conciergeForm.message}
                      onChange={(e) => setConciergeForm({ ...conciergeForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:scale-105 transition-transform"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Solicită Consultanță Gratuită
                  </Button>

                  <p className="text-xs text-white/60 text-center">
                    * Te vom contacta în maxim 24h pentru a discuta în detaliu călătoria ta de vis
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mt-12 text-center">
              <div>
                <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <h4 className="font-bold mb-1">Răspuns în 24h</h4>
                <p className="text-sm text-white/70">Concierge disponibil non-stop</p>
              </div>
              <div>
                <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <h4 className="font-bold mb-1">100% Personalizat</h4>
                <p className="text-sm text-white/70">Itinerariu unic pentru tine</p>
              </div>
              <div>
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <h4 className="font-bold mb-1">Experți Certificați</h4>
                <p className="text-sm text-white/70">10+ ani experiență în luxury travel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ce Spun Clienții Noștri Premium</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Alexandra & Mihai',
                trip: 'Santorini Deluxe',
                rating: 5,
                comment: 'Experiență absolut magică! Fiecare detaliu a fost perfect, de la zbor până la ultima cină. Concierge-ul a fost disponibil 24/7 și a făcut totul să fie perfect.'
              },
              {
                name: 'Cristina P.',
                trip: 'Maldives Ultra Luxury',
                rating: 5,
                comment: 'Am ales pachetul Platinum și a meritat fiecare cent! Villa pe apă, butler personal, spa nelimitat - a fost paradis pe pământ. Recomand cu toată inima!'
              },
              {
                name: 'Adrian & Elena',
                trip: 'Swiss Alps Retreat',
                rating: 5,
                comment: 'Chalet-ul era un vis, ski-ul cu instructor privat extraordinar, mâncarea la nivel Michelin. BooksyGo Premium depășește așteptările!'
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.trip}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

