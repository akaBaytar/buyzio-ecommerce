import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

import Stripe from 'stripe';

import { Button } from '@/components/ui/button';

import { APP_NAME } from '@/constants';
import { getOrder } from '@/actions/order.action';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
};

const PaymentSuccessPage = async ({ params, searchParams }: PageProps) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const { id } = await params;
  const { payment_intent: payment_intent_id } = await searchParams;

  const order = await getOrder(id);

  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  const isSucceeded = paymentIntent.status === 'succeeded';

  if (!isSucceeded) return redirect(`/orders/${id}`);

  return (
    <div className='space-y-5 flex-center w-full h-full max-w-2xl mx-auto'>
      <div className='flex flex-col gap-5 items-center'>
        <Image
          src='/assets/logo.svg'
          priority
          alt={APP_NAME}
          width={120}
          height={120}
        />
        <p className='text-muted-foreground text-xs'>Order ID: {id}</p>
        <h1 className='h2-bold'>Thanks for your purchase</h1>
        <p className='font-medium text-center text-balance leading-loose'>
          Your payment has been successfully received and we are starting to
          prepare your order.
        </p>
        <Button asChild>
          <Link href={`/orders/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
