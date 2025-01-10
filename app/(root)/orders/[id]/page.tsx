import { notFound } from 'next/navigation';

import OrderDetailsTable from '@/components/shared/order-details-table';

import { auth } from '@/auth';
import { getOrder } from '@/actions/order.action';

import type { Metadata } from 'next';
import type { User } from '@prisma/client';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async ({ params }: PageProps) => {
  const id = (await params).id;

  const order = await getOrder(id);

  if (!order) notFound();

  const session = await auth();

  const isAdmin = (session?.user as User)?.role === 'admin';

  return (
    <>
      <OrderDetailsTable
        isAdmin={isAdmin || false}
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
