'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <XCircle className="w-16 h-16 text-orange-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Plată Anulată
          </h1>
          <p className="text-lg text-gray-600">
            Nu te îngrijora, nu s-a perceput nicio taxă.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
          <h2 className="font-semibold text-gray-900">Ai întrebări?</h2>
          <p className="text-gray-700">
            Echipa noastră este aici să te ajute. Contactează-ne pentru orice nelămurire despre pachete, prețuri sau procesul de plată.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la Pachete
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/premium')}
            className="gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Vorbește cu un Consultant
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Rezervarea ta nu a fost procesată și nu a fost perceput niciun cost.
        </p>
      </Card>
    </div>
  );
}

