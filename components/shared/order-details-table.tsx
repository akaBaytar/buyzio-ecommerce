'use client';

import { useTransition } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Loader2Icon } from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import { useToast } from '@/hooks/use-toast';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { createPayPalOrder, approvePayPalOrder } from '@/actions/order.action';
import { markOrderAsPaid, markOrderAsDelivered } from '@/actions/admin.action';

import type { Order } from '@/types';

type PropTypes = {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
};

const OrderDetailsTable = ({ order, isAdmin, paypalClientId }: PropTypes) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const {
    id,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isDelivered,
    isPaid,
    deliveredAt,
    paidAt,
    paymentMethod,
    shippingAddress,
    orderItems,
  } = order;

  const createPaypalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    toast({ description: res.message });

    return res.data;
  };

  const approvePaypalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast({ description: res.message });
  };

  const markAsPaid = () => {
    startTransition(async () => {
      const response = await markOrderAsPaid(id);

      toast({ description: response.message });
    });
  };

  const markAsDelivered = () => {
    startTransition(async () => {
      const response = await markOrderAsDelivered(id);

      toast({ description: response.message });
    });
  };

  return (
    <>
      <h1 className='mt-5 h2-bold'>Order Details</h1>
      <p className='mb-5 text-xs text-muted-foreground'>Order ID: {id}</p>
      <div className='grid grid-cols-1 gap-5 lg:gap-10 lg:grid-cols-6'>
        <div className='lg:col-span-4 overflow-x-auto space-y-5'>
          <Card className='border-input'>
            <CardContent className='p-5 space-y-2.5'>
              <h2 className='font-semibold'>Payment Method</h2>
              <p className='text-sm'>{paymentMethod}</p>
              {isPaid ? (
                <Badge
                  variant='outline'
                  className='p-1.5 px-3 font-light border-input'>
                  Paid at: {formatDate(paidAt as Date).dateAndTime}
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='p-1.5 px-3 font-light border-input'>
                  Not paid yet
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className='border-input'>
            <CardContent className='p-5 space-y-2.5'>
              <h2 className='font-semibold'>Shipping Address</h2>
              <div className='text-sm space-y-1'>
                <p>{shippingAddress.fullName}</p>
                <p>
                  {shippingAddress.streetAddress}, {shippingAddress.city}
                </p>
                <p>
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
              {isDelivered ? (
                <Badge
                  variant='outline'
                  className='p-1.5 px-3 font-light border-input'>
                  Delivered at: {formatDate(deliveredAt as Date).dateAndTime}
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='p-1.5 px-3 font-light border-input'>
                  Not delivered yet
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className='border-input'>
            <CardContent className='p-5 space-y-2.5'>
              <h2 className='font-semibold'>Ordered Products</h2>
              <Table>
                <TableHeader>
                  <TableRow className='border-input hover:bg-inherit'>
                    <TableHead>Product</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-end'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map(({ image, name, price, qty, slug }) => (
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
        <div className={cn('lg:col-span-2', isAdmin && 'space-y-5')}>
          <Card className='border-input'>
            <CardContent className='p-5 space-y-5'>
              <h2 className='font-semibold'>Amount</h2>
              <div className='flex-between'>
                <p className='text-sm'>
                  Subtotal for {orderItems.reduce((acc, i) => acc + i.qty, 0)}{' '}
                  product:
                </p>
                <span className='font-semibold'>
                  {formatCurrency(itemsPrice)}
                </span>
              </div>
              <div className='flex-between'>
                <p className='text-sm'>Tax:</p>
                <span className='font-semibold'>
                  {formatCurrency(taxPrice)}
                </span>
              </div>
              <div className='flex-between'>
                <p className='text-sm'>Shipping:</p>
                <span className='font-semibold'>
                  {formatCurrency(shippingPrice)}
                </span>
              </div>
              <div className='flex-between text-lg font-bold pt-5 border-t border-input'>
                <p>Total:</p>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {isPaid ? (
                <p className='text-xs text-center bg-input p-2.5 rounded-md'>
                  Paid at {formatDate(paidAt as Date).date} via {paymentMethod}
                </p>
              ) : !isPaid && paymentMethod !== 'Paypal' ? (
                <p className='text-xs text-center bg-input p-2.5 rounded-md'>
                  Not paid yet
                </p>
              ) : null}
              {!isPaid && paymentMethod === 'Paypal' && (
                <div style={{ colorScheme: 'none' }}>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      createOrder={createPaypalOrder}
                      onApprove={approvePaypalOrder}
                      style={{
                        disableMaxWidth: true,
                        layout: 'horizontal',
                        tagline: false,
                        height: 36,
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </CardContent>
          </Card>
          {!isPaid && isAdmin && (
            <Card className='border-input'>
              <CardHeader>
                <CardTitle>Order Processes</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  disabled={isPending}
                  onClick={markAsPaid}
                  className='w-full'>
                  {isPending ? (
                    <Loader2Icon className='size-4 animate-spin' />
                  ) : (
                    'Mark as Paid'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          {isPaid && !isDelivered && isAdmin && (
            <Card className='border-input'>
              <CardHeader>
                <CardTitle>Order Processes</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant='outline'
                  disabled={isPending}
                  onClick={markAsDelivered}
                  className='w-full'>
                  {isPending ? (
                    <Loader2Icon className='size-4 animate-spin' />
                  ) : (
                    'Mark as Delivered'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
