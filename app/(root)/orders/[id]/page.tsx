import { notFound } from 'next/navigation';

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

  return <>Order Details</>;
};

export default OrderDetailsPage;
