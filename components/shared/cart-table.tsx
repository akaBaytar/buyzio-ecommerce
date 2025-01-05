'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Loader2Icon, MinusIcon, PlusIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from '../ui/table';

import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { addToCart, removeFromCart } from '@/actions/cart.actions';

import type { Cart, CartItem } from '@/types';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const addToCartHandler = async (item: CartItem) => {
    startTransition(async () => {
      const response = await addToCart(item);

      toast({ description: response.message });
    });
  };

  const removeFromCartHandler = async (id: string) => {
    startTransition(async () => {
      const response = await removeFromCart(id);

      toast({ description: response.message });
    });
  };

  return (
    <>
      <h1 className='h2-bold py-5'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <p className='text-sm bg-input p-2.5 rounded-md'>
          No items in your shopping cart.
          <Link href='/' className='underline ms-1 hover:no-underline'>
            Browse products.
          </Link>
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-6'>
          <div className='overflow-x-auto lg:col-span-4'>
            <Table>
              <TableHeader>
                <TableRow className='border-input'>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead className='text-end'>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug} className='border-input'>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className='flex items-center gap-1.5'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                        />
                        <span className='text-xs'>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className='flex-center gap-1.5 min-h-[66.5px]'>
                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        disabled={isPending}
                        className='size-7'
                        onClick={() => removeFromCartHandler(item.productId)}>
                        <MinusIcon className='size-4' />
                      </Button>
                      <span className='size-7 border border-input flex-center rounded-md select-none'>
                        {isPending ? (
                          <Loader2Icon className='animate-spin size-4' />
                        ) : (
                          item.qty
                        )}
                      </span>
                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        disabled={isPending}
                        className='size-7'
                        onClick={() => addToCartHandler(item)}>
                        <PlusIcon className='size-4' />
                      </Button>
                    </TableCell>
                    <TableCell className='text-end'>
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card className='border-input lg:col-span-2'>
            <CardContent className='p-5 flex flex-col gap-5'>
              <div className='flex-between'>
                <p className='text-sm'>
                  Subtotal for {cart.items.reduce((acc, i) => acc + i.qty, 0)}{' '}
                  product:
                </p>
                <span className='font-semibold'>
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <div className='flex-between'>
                <p className='text-sm'>Tax:</p>
                <span className='font-semibold'>
                  {formatCurrency(cart.taxPrice)}
                </span>
              </div>
              <div className='flex-between'>
                <p className='text-sm'>Shipping:</p>
                <span className='font-semibold'>
                  {formatCurrency(cart.shippingPrice)}
                </span>
              </div>
              <div className='flex-between text-lg font-bold pt-5 border-t'>
                <p>Total:</p>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <Button
                type='button'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
                className='w-full'>
                {isPending ? (
                  <Loader2Icon className='animate-spin size-4' />
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
