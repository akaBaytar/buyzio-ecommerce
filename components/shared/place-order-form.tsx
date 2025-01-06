'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import { Button } from '../ui/button';

import { createOrder } from '@/actions/order.action';

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className='w-full'>
      {pending ? (
        <Loader2Icon className='size-4 animate-spin' />
      ) : (
        'Place Order'
      )}
    </Button>
  );
};

const PlaceOrderForm = () => {
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createOrder();

    if (response.redirectTo) router.push(response.redirectTo);
  };

  return (
    <form onSubmit={onSubmit} className='w-full'>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
