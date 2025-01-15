import { notFound } from 'next/navigation';

import Stripe from 'stripe';

import OrderDetailsTable from '@/components/shared/order-details-table';

import { auth } from '@/auth';
import { getOrder } from '@/actions/order.action';

import type { Metadata } from 'next';
import type { Order } from '@/types';
import type { User } from '@prisma/client';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async ({ params }: PageProps) => {
  const id = (await params).id;

  const order: Order = await getOrder(id);

  if (!order) notFound();

  const session = await auth();

  const isAdmin = (session?.user as User)?.role === 'admin';

  let client_secret = null;

  if (order.paymentMethod === 'Credit Card' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
      shipping: {
        name: order.shippingAddress.fullName,
        address: {
          city: order.shippingAddress.city,
          country: order.shippingAddress.country,
          postal_code: order.shippingAddress.postalCode,
          line1: order.shippingAddress.streetAddress,
        },
      },
    });

    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetailsTable
        isAdmin={isAdmin || false}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        order={{
          ...order,
          shippingAddress: order.shippingAddress,
        }}
      />
    </>
  );
};

export default OrderDetailsPage;
