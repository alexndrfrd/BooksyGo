'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plane, Hotel, Users, Calendar, ArrowRight, Sparkles, Trophy, Target, Package } from "lucide-react";
import { useState } from "react";
import { AIChat, ChatButton } from "@/components/ai-chat";
import { LocationAutocomplete } from "@/components/location-autocomplete";

export default function Home() {
  const [searchType, setSearchType] = useState<'flights' | 'hotels' | 'packages'>('flights');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Flight search state
  const [flightOrigin, setFlightOrigin] = useState<any>(null);
  const [flightDestination, setFlightDestination] = useState<any>(null);
  const [flightDate, setFlightDate] = useState('');
  const [flightPassengers, setFlightPassengers] = useState(1);
  
  const handleFlightSearch = () => {
    const origin = flightOrigin?.iataCode || 'OTP';
    const destination = flightDestination?.iataCode || 'LON';
    const date = flightDate || '2025-12-15';
    const adults = flightPassengers || 1;
    window.location.href = `/search?origin=${origin}&destination=${destination}&date=${date}&adults=${adults}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-transparent.png" 
                alt="BooksyGo Logo" 
                width={50} 
                height={50}
              />
              <span className="text-xl font-bold text-white">BooksyGo</span>
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-white/90">
              <a href="#features" className="hover:text-booksy-gold transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-booksy-gold transition-colors">How It Works</a>
              <a href="/premium" className="hover:text-booksy-gold transition-colors flex items-center gap-1">
                <span className="text-yellow-400">👑</span>
                Premium
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => window.location.href = '/auth/login'}
              >
                Log In
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.href = '/auth/register'}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ 
          backgroundImage: "linear-gradient(rgba(75, 17, 111, 0.5), rgba(75, 17, 111, 0.5)), url('/hero-airplane.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-booksy-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-booksy-gold/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Descoperă <span className="text-booksy-gold">Călătorii de Vis</span>
              <br />
              cu Cele Mai Bune Oferte
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              AI scanează 60+ zile pentru cele mai bune prețuri. 
              Economisești până la <span className="font-bold text-booksy-gold">50%</span> pe fiecare călătorie.
            </p>

            {/* Search Bar */}
            <Card className="max-w-4xl mx-auto shadow-2xl">
              <CardContent className="p-6">
                {/* Search Type Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1.5 border border-white/20">
                    <button
                      onClick={() => setSearchType('flights')}
                      className={`px-6 py-3 rounded-md font-medium transition-all ${
                        searchType === 'flights'
                          ? 'bg-white text-primary shadow-lg scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-102'
                      }`}
                    >
                      <Plane className="w-4 h-4 inline mr-2" />
                      Zboruri
                    </button>
                    <button
                      onClick={() => setSearchType('hotels')}
                      className={`px-6 py-3 rounded-md font-medium transition-all ${
                        searchType === 'hotels'
                          ? 'bg-white text-primary shadow-lg scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-102'
                      }`}
                    >
                      <Hotel className="w-4 h-4 inline mr-2" />
                      Hoteluri
                    </button>
                    <button
                      onClick={() => setSearchType('packages')}
                      className={`px-6 py-3 rounded-md font-medium transition-all ${
                        searchType === 'packages'
                          ? 'bg-white text-primary shadow-lg scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-102'
                      }`}
                    >
                      <Package className="w-4 h-4 inline mr-2" />
                      Pachete
                    </button>
                  </div>
                </div>

                {searchType === 'flights' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Origin - with Autocomplete */}
                      <LocationAutocomplete
                        placeholder="De unde? (ex: Bucharest)"
                        value=""
                        onChange={setFlightOrigin}
                        icon={<Plane className="w-5 h-5 text-primary" />}
                      />

                      {/* Destination - with Autocomplete */}
                      <LocationAutocomplete
                        placeholder="Încotro? (ex: London)"
                        value=""
                        onChange={setFlightDestination}
                        icon={<Target className="w-5 h-5 text-primary" />}
                      />

                      {/* Date */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Input
                          type="date"
                          value={flightDate}
                          onChange={(e) => setFlightDate(e.target.value)}
                          className="border-0 p-0 focus-visible:ring-0"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      {/* Passengers */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                        <Input
                          type="number"
                          value={flightPassengers}
                          onChange={(e) => setFlightPassengers(parseInt(e.target.value) || 1)}
                          min="1"
                          max="9"
                          placeholder="Adulți"
                          className="border-0 p-0 focus-visible:ring-0"
                        />
                      </div>

                      {/* Search Button */}
                      <Button
                        size="lg"
                        className="w-full h-auto py-3"
                        onClick={handleFlightSearch}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Caută Zboruri
                      </Button>
                    </div>
                    {/* AI Helper Button */}
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:scale-105 transition-all shadow-lg"
                        onClick={() => setIsChatOpen(true)}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        💬 Sau întreabă AI-ul despre călătoria ta
                      </Button>
                    </div>
                  </div>
                )}

                {searchType === 'hotels' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Destination */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Hotel className="w-5 h-5 text-primary" />
                        <Input
                          placeholder="Destinație"
                          className="border-0 p-0 focus-visible:ring-0"
                        />
                      </div>

                      {/* Check-in */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Input
                          type="date"
                          placeholder="Check-in"
                          className="border-0 p-0 focus-visible:ring-0"
                        />
                      </div>

                      {/* Check-out */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Input
                          type="date"
                          placeholder="Check-out"
                          className="border-0 p-0 focus-visible:ring-0"
                        />
                      </div>

                      {/* Search Button */}
                      <Button
                        size="lg"
                        className="w-full h-auto py-3"
                        onClick={() => {
                          const destination = (document.querySelector('input[placeholder="Destinație"]') as HTMLInputElement)?.value || 'Budapest';
                          const checkIn = (document.querySelector('input[placeholder="Check-in"]') as HTMLInputElement)?.value || '2025-11-15';
                          const checkOut = (document.querySelector('input[placeholder="Check-out"]') as HTMLInputElement)?.value || '2025-11-17';
                          const guests = 2;
                          window.location.href = `/hotels?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
                        }}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Caută Hoteluri
                      </Button>
                    </div>
                    {/* AI Helper Button */}
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:scale-105 transition-all shadow-lg"
                        onClick={() => setIsChatOpen(true)}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        💬 Sau întreabă AI-ul despre cazarea ideală
                      </Button>
                    </div>
                  </div>
                )}

                {searchType === 'packages' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Destination */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Target className="w-5 h-5 text-primary" />
                        <Input
                          placeholder="Unde vrei să mergi?"
                          className="border-0 p-0 focus-visible:ring-0"
                          id="package-destination"
                        />
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Input
                          type="number"
                          placeholder="Câte zile?"
                          className="border-0 p-0 focus-visible:ring-0"
                          id="package-duration"
                          min="1"
                          defaultValue="5"
                        />
                      </div>

                      {/* Budget */}
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <Input
                          type="number"
                          placeholder="Buget (EUR)"
                          className="border-0 p-0 focus-visible:ring-0"
                          id="package-budget"
                          defaultValue="1000"
                        />
                      </div>

                      {/* Search Button */}
                      <Button
                        size="lg"
                        className="w-full h-auto py-3"
                        onClick={() => {
                          const destination = (document.getElementById('package-destination') as HTMLInputElement)?.value || 'Paris';
                          const duration = (document.getElementById('package-duration') as HTMLInputElement)?.value || '5';
                          const budget = (document.getElementById('package-budget') as HTMLInputElement)?.value || '1000';
                          window.location.href = `/packages?destination=${destination}&duration=${duration}&budget=${budget}`;
                        }}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Caută Pachete
                      </Button>
                    </div>
                    {/* AI Helper Button */}
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:scale-105 transition-all shadow-lg"
                        onClick={() => setIsChatOpen(true)}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        💬 Sau cere AI-ului să creeze pachetul perfect
                      </Button>
                    </div>
                  </div>
                )}

                {/* Flexible Search Toggle */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" id="flexible" className="rounded" defaultChecked />
                  <label htmlFor="flexible" className="cursor-pointer">
                    🔍 Caută flexibil (±1 lună) pentru cele mai bune prețuri
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              <div>
                <strong className="text-2xl text-booksy-gold">10K+</strong>
                <p>Călători fericiți</p>
              </div>
              <div>
                <strong className="text-2xl text-booksy-gold">€2M+</strong>
                <p>Economisiți de utilizatori</p>
              </div>
              <div>
                <strong className="text-2xl text-booksy-gold">150+</strong>
                <p>Destinații</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-background" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              De ce BooksyGo?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tehnologie de ultimă oră pentru cea mai bună experiență de călătorie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Căutare Flexibilă 2 Luni</CardTitle>
                <CardDescription className="text-base">
                  AI-ul nostru scanează automat 60+ de date în jurul călătoriei tale pentru a găsi cele mai bune oferte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-booksy-gold rounded-full" />
                    Economisești până la 50%
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-booksy-gold rounded-full" />
                    Rezultate în 2-3 minute
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-booksy-gold rounded-full" />
                    Top 5 cele mai bune prețuri
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-secondary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">AI Travel Assistant</CardTitle>
                <CardDescription className="text-base">
                  Recomandări personalizate bazate pe preferințele și istoricul tău de călătorii
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Sugestii inteligente
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Itinerarii generate automat
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Chat 24/7 cu AI
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Gamification & Rewards</CardTitle>
                <CardDescription className="text-base">
                  Câștigă puncte la fiecare rezervare și deblochează reduceri exclusive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-booksy-gold rounded-full" />
                    BooksyPoints pe fiecare booking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-booksy-gold rounded-full" />
                    Badge-uri și achievements
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-booksy-gold rounded-full" />
                    Reduceri VIP
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-muted/30" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Cum Funcționează?
            </h2>
            <p className="text-lg text-muted-foreground">
              Simplu, rapid și eficient - în doar 3 pași
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-3xl font-bold text-secondary-foreground shadow-lg">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Caută</h3>
                  <p className="text-muted-foreground">
                    Introdu destinația dorită și alege căutare flexibilă pentru cele mai bune oferte
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-10 -right-4 text-booksy-gold">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Alege</h3>
                  <p className="text-muted-foreground">
                    AI-ul nostru îți prezintă top 5 cele mai bune opțiuni cu economii de până la 50%
                  </p>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-10 -right-4 text-booksy-gold">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-3xl font-bold text-secondary-foreground shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-foreground">Rezervă</h3>
                <p className="text-muted-foreground">
                  Finalizează rezervarea instant și primești confirmarea pe email în câteva secunde
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden bg-booksy-purple" id="pricing">
        {/* Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-booksy-purple via-booksy-purple to-booksy-dark" />
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-booksy-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-booksy-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Începe Aventura Ta Astăzi
            </h2>
            <p className="text-lg text-white/90">
              Alătură-te miilor de călători care economisesc timp și bani cu BooksyGo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform">
                Sign Up Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white bg-transparent hover:bg-white/20">
                <Plane className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            <p className="text-sm text-white/70">
              ✨ No credit card required • 🎁 100 BooksyPoints bonus • 🔒 Secure & Safe
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-transparent.png" 
                alt="BooksyGo Logo" 
                width={32} 
                height={32}
              />
              <div className="text-xl font-bold text-primary">BooksyGo</div>
              <span className="text-muted-foreground">• Where dreams begin</span>
            </div>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Features</a>
              <a href="#" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 BooksyGo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chat */}
      <ChatButton onClick={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
