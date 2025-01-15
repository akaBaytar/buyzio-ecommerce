'use client';

import { FormEvent, useState } from 'react';

import { useTheme } from 'next-themes';
import { Loader2Icon } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';

import { Button } from '../ui/button';

import { SERVER_URL } from '@/constants';
import { formatCurrency } from '@/lib/utils';

type PropTypes = {
  price: number;
  orderId: string;
  clientSecret: string;
};

const StripeForm = ({ price, orderId }: { price: number; orderId: string }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (stripe == null || elements == null || email == null) return;

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/orders/${orderId}/payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message ?? 'An error occurred.');
        } else if (error) {
          setErrorMessage('An error occurred.');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form
      onSubmit={onSubmit}
      className='space-y-2.5 border-t pt-5 border-input'>
      <h3 className='text-lg font-bold'>Stripe Checkout</h3>
      {errorMessage && <p className='text-sm'>{errorMessage}</p>}
      <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      <PaymentElement />
      <Button
        size='lg'
        disabled={isLoading || stripe == null || elements == null}
        className='w-full !mt-5'>
        {isLoading ? (
          <Loader2Icon className='size-4 animate-spin' />
        ) : (
          `Purchase ${formatCurrency(price / 100)}`
        )}
      </Button>
    </form>
  );
};

const PaymentWithStripe = ({ clientSecret, orderId, price }: PropTypes) => {
  const { theme } = useTheme();

  return (
    <Elements
      stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)}
      options={{
        clientSecret,
        appearance: { theme: theme === 'dark' ? 'night' : 'stripe' },
      }}>
      <StripeForm price={price} orderId={orderId} />
    </Elements>
  );
};

export default PaymentWithStripe;
