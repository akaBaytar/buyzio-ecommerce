import Link from 'next/link';
import { Metadata } from 'next';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';

import Pagination from '@/components/shared/pagination';

import { formatCurrency, formatDate, formatID } from '@/lib/utils';
import { getOrders } from '@/actions/order.action';

import type { Order } from '@/types';

export const metadata: Metadata = {
  title: 'My Orders',
};

type PageProps = {
  searchParams: Promise<{ page: string }>;
};

const OrdersPage = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;

  const response = await getOrders({ page: +page || 1 });

  const { orders, orderCount, totalPages } = response;

  return (
    <>
      <div className='flex-between my-5'>
        <h1 className='h2-bold'>Orders</h1>
        {totalPages && totalPages > 1 && (
          <Pagination page={+page || 1} totalPages={totalPages} />
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow className='border-input hover:bg-inherit'>
            <TableHead className='min-w-[16ch]'>Order ID</TableHead>
            <TableHead className='min-w-[16ch]'>Ordered At</TableHead>
            <TableHead className='min-w-[16ch]'>Payment Method</TableHead>
            <TableHead className='min-w-[16ch]'>Total Price</TableHead>
            <TableHead className='min-w-[16ch]'>Payment Status</TableHead>
            <TableHead className='min-w-[16ch]'>Delivered</TableHead>
            <TableHead className='min-w-[16ch]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order: Order) => (
            <TableRow key={order.id} className='text-xs border-input'>
              <TableCell title={order.id}>{formatID(order.id)}</TableCell>
              <TableCell>{formatDate(order.createdAt).dateAndTime}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>
                {order.isPaid
                  ? formatDate(order.paidAt as Date).date
                  : 'Not paid'}
              </TableCell>
              <TableCell>
                {order.isDelivered
                  ? formatDate(order.deliveredAt as Date).date
                  : 'Not delivered'}
              </TableCell>
              <TableCell>
                <Link href={`/orders/${order.id}`}>Show Details</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className='text-xs'>
          Page: {page} of {totalPages} - Total Order: {orderCount}
        </TableCaption>
      </Table>
    </>
  );
};

export default OrdersPage;
