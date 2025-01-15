import { NextResponse, NextRequest } from 'next/server';

import Stripe from 'stripe';

import { updateOrderAsPaid } from '@/actions/order.action';

export const POST = async (req: NextRequest) => {
  const event = Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === 'charge.succeeded') {
    const { object } = event.data;

    await updateOrderAsPaid({
      id: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: 'COMPLETED',
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    return NextResponse.json({
      message: 'Order updated as paid successfully.',
    });
  }

  return NextResponse.json({ message: 'Order is not charged.' });
};
