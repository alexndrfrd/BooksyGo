'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId] = useState(searchParams.get('session_id'));

  useEffect(() => {
    // TODO: Verify payment with backend
    // await fetch('/api/stripe/verify-payment', {
    //   method: 'POST',
    //   body: JSON.stringify({ sessionId }),
    // });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Plată Confirmată! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Rezervarea ta premium a fost procesată cu succes.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
          <h2 className="font-semibold text-gray-900">Ce urmează?</h2>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Vei primi un email de confirmare în maxim 5 minute</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Echipa noastră de concierge te va contacta în 24 ore pentru detalii</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Vei primi itinerariu complet și toate voucherele necesare</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Suport 24/7 disponibil pentru întrebări</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="gap-2"
          >
            Vezi Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Salvează Confirmare
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Session ID: {sessionId || 'N/A'}
        </p>
      </Card>
    </div>
  );
}

