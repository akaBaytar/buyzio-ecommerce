import Link from 'next/link';

import { EyeIcon } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

import Pagination from '@/components/shared/pagination';
import RemoveDialog from '@/components/shared/remove-dialog';

import { auth } from '@/auth';
import { getAllOrders, removeOrder } from '@/actions/admin.action';
import { formatCurrency, formatDate, formatID } from '@/lib/utils';

import type { Metadata } from 'next';
import type { Order } from '@/types';
import type { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'All Orders',
};

type PageProps = {
  searchParams: Promise<{ page: string }>;
};

const AllOrdersPage = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;

  const session = await auth();

  if ((session?.user as User).role !== 'admin') throw new Error('AUTH');

  const response = await getAllOrders({ page: +page || 1, limit: 10 });

  const { orderCount, orders, totalPages } = response;

  return (
    <>
      <div className='flex-between my-5'>
        <h1 className='h2-bold'>All Orders</h1>
        {totalPages && totalPages > 1 && (
          <Pagination page={+page || 1} totalPages={totalPages} />
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow className='border-input hover:bg-inherit'>
            <TableHead className='min-w-[16ch]'>Order ID</TableHead>
            <TableHead className='min-w-[16ch]'>Customer</TableHead>
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
              <TableCell>{order.user.name}</TableCell>
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
              <TableCell className='space-x-1'>
                <Button
                  asChild
                  size='icon'
                  variant='outline'
                  title='Show Details'>
                  <Link href={`/orders/${order.id}`}>
                    <EyeIcon />
                  </Link>
                </Button>
                <RemoveDialog id={order.id} action={removeOrder} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className='text-xs'>
          Page: {page || '1'} of {totalPages} - Total Order: {orderCount}
        </TableCaption>
      </Table>
    </>
  );
};

export default AllOrdersPage;
