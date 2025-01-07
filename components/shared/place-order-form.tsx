'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import { Button } from '../ui/button';

import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/actions/order.action';

const PlaceOrderButton = ({ paymentMethod }: { paymentMethod?: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className='w-full'>
      {pending ? (
        <Loader2Icon className='size-4 animate-spin' />
      ) : paymentMethod ? (
        `Place Order via ${paymentMethod}`
      ) : (
        'Place Order'
      )}
    </Button>
  );
};

const PlaceOrderForm = ({ paymentMethod }: { paymentMethod: string }) => {
  const router = useRouter();

  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createOrder();

    toast({
      description: response.message,
    });

    if (response.redirectTo) router.push(response.redirectTo);
  };

  return (
    <form onSubmit={onSubmit} className='w-full'>
      <PlaceOrderButton paymentMethod={paymentMethod} />
    </form>
  );
};

export default PlaceOrderForm;
