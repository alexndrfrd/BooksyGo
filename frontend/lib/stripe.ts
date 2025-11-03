/**
 * Stripe Integration
 * Handles payment processing for Premium Packages and Concierge services
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

/**
 * Create checkout session for Premium Package
 */
export async function createPackageCheckout(data: {
  packageId: string;
  packageName: string;
  price: number;
  currency: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}): Promise<{ sessionId: string; url: string }> {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      type: 'package',
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
}

/**
 * Create checkout session for Concierge Service
 */
export async function createConciergeCheckout(data: {
  serviceType: 'one-time' | 'monthly' | 'yearly';
  price: number;
}): Promise<{ sessionId: string; url: string }> {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      type: 'concierge',
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
}

/**
 * Create checkout session for Membership
 */
export async function createMembershipCheckout(data: {
  tier: 'gold' | 'platinum' | 'diamond';
  price: number;
  interval: 'month' | 'year';
}): Promise<{ sessionId: string; url: string }> {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      type: 'membership',
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  return response.json();
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    throw error;
  }
}

