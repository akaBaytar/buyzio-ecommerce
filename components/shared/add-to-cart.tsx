'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { PlusIcon, MinusIcon, Loader2Icon } from 'lucide-react';

import { Button } from '../ui/button';
import { ToastAction } from '../ui/toast';

import { useToast } from '@/hooks/use-toast';

import { addToCart, removeFromCart } from '@/actions/cart.actions';

import type { Cart, CartItem } from '@/types';

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const inCart = cart && cart.items.find((i) => i.productId === item.productId);

  const addToCartHandler = async () => {
    startTransition(async () => {
      const response = await addToCart(item);

      if (!response.success) toast({ description: response.message });

      toast({
        description: response.message,
        action: (
          <ToastAction
            altText='Go to Cart'
            onClick={() => router.push('/cart')}
            className='border-input'>
            Go to Cart
          </ToastAction>
        ),
      });
    });
  };

  const removeFromCartHandler = async () => {
    startTransition(async () => {
      const response = await removeFromCart(item.productId);

      toast({
        description: response.message,
      });
    });
  };

  return inCart ? (
    <div className='flex justify-between w-full rounded-md ms-auto mt-2.5'>
      <p className='lg:hidden'>Quantity </p>
      <div className='flex-between gap-2.5 lg:w-full'>
        <Button
          type='button'
          size='icon'
          variant='outline'
          onClick={removeFromCartHandler}>
          <MinusIcon className='size-4' />
        </Button>
        <span className='h-9 w-16 border border-input flex-center text-lg rounded-md select-none'>
          {isPending ? (
            <Loader2Icon className='animate-spin size-4' />
          ) : (
            inCart.qty
          )}
        </span>
        <Button
          type='button'
          size='icon'
          variant='outline'
          onClick={addToCartHandler}>
          <PlusIcon className='size-4' />
        </Button>
      </div>
    </div>
  ) : (
    <Button type='button' onClick={addToCartHandler} className='w-full mt-2.5'>
      {isPending ? (
        <Loader2Icon className='animate-spin size-4' />
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
};

export default AddToCart;
