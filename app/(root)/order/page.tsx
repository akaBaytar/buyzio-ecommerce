import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { EditIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TableHeader,
} from '@/components/ui/table';

import CheckoutSteps from '@/components/shared/checkout-steps';

import { auth } from '@/auth';
import { formatCurrency } from '@/lib/utils';
import { getUser } from '@/actions/user.action';
import { getUserCart } from '@/actions/cart.actions';

import type { Metadata } from 'next';
import type { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Place Order',
};

const PlaceOrderPage = async () => {
  const session = await auth();
  const cart = await getUserCart();

  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found.');

  const user = await getUser(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping');
  if (!user.paymentMethod) redirect('/payment');

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps currentStep='Place Order' />
      <h1 className='my-5 h2-bold'>Place Order</h1>
      <div className='grid grid-cols-1 gap-5 lg:gap-10 lg:grid-cols-6'>
        <div className='lg:col-span-4 overflow-x-auto space-y-5'>
          <Card className='border-input'>
            <CardContent className='p-5 gap-5'>
              <div className='flex-between mb-2.5'>
                <h2 className='font-semibold'>Shipping Address</h2>
                <Link href='/shipping'>
                  <Button variant='outline' size='sm'>
                    <EditIcon className='size-4' />
                    Change Address
                  </Button>
                </Link>
              </div>
              <div className='flex flex-col gap-1 text-sm'>
                <p>{userAddress.fullName}</p>
                <p>
                  {userAddress.streetAddress}, {userAddress.city}
                </p>
                <p>
                  {userAddress.postalCode}, {userAddress.country}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className='border-input'>
            <CardContent className='p-5 gap-5'>
              <div className='flex-between mb-2.5'>
                <h2 className='font-semibold'>Payment Method</h2>
                <Link href='/payment'>
                  <Button variant='outline' size='sm'>
                    <EditIcon className='size-4' />
                    Change Payment
                  </Button>
                </Link>
              </div>
              <p className='text-sm'>{user.paymentMethod}</p>
            </CardContent>
          </Card>
          <Card className='border-input'>
            <CardContent className='p-5 gap-5'>
              <h2 className='pb-2.5 font-semibold'>Order Details</h2>
              <Table>
                <TableHeader>
                  <TableRow className='border-input hover:bg-inherit'>
                    <TableHead>Product</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-end'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map(({ image, name, price, qty, slug }) => (
                    <TableRow key={slug} className='border-input'>
                      <TableCell>
                        <Link
                          href={`/product/${slug}`}
                          className='flex items-center gap-1.5'>
                          <Image
                            src={image}
                            alt={name}
                            width={40}
                            height={40}
                          />
                          <span className='text-xs'>{name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='block text-center'>{qty}</span>
                      </TableCell>
                      <TableCell>
                        <span className='block text-end'>
                          {formatCurrency(price)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className='lg:col-span-2'>
          <Card className='border-input'>
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
              <div className='flex-between text-lg font-bold pt-5 border-t border-input'>
                <p>Total:</p>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <Button type='button' className='w-full'>
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
