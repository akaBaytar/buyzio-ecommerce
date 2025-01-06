import { notFound } from 'next/navigation';

import OrderDetailsTable from '@/components/shared/order-details-table';

import { getOrder } from '@/actions/order.action';

import type { Metadata } from 'next';

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

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress,
        }}
      />
    </>
  );
};

export default OrderDetailsPage;
