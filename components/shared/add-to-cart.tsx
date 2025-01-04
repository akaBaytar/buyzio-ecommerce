'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import { ToastAction } from '../ui/toast';

import { useToast } from '@/hooks/use-toast';

import { addToCart } from '@/actions/cart.actions';

import type { CartItem } from '@/types';

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const { toast } = useToast();

  const onClick = async () => {
    const response = await addToCart(item);

    if (!response.success) return toast({ description: response.message });

    toast({
      description: `${item.name} added to cart successfully.`,
      action: (
        <ToastAction
          altText='Go to Cart'
          onClick={() => router.push('/cart')}
          className='border-input'>
          Go to Cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button type='button' size='lg' onClick={onClick} className='w-full mt-2.5'>
      Add to Cart
    </Button>
  );
};

export default AddToCart;
