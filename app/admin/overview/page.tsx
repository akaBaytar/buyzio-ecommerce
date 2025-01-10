import Link from 'next/link';

import {
  ShirtIcon,
  UsersIcon,
  HandCoinsIcon,
  CreditCardIcon,
} from 'lucide-react';

import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Charts from '@/components/layout/charts';

import { auth } from '@/auth';
import { getSummary } from '@/actions/order.action';
import { formatCurrency, formatDate } from '@/lib/utils';

import type { Metadata } from 'next';
import type { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Admin Overview',
};

const OverviewPage = async () => {
  const session = await auth();

  if ((session?.user as User)?.role !== 'admin') throw new Error('AUTH');

  const summary = await getSummary();

  return (
    <div className='space-y-5'>
      <h1 className='h2-bold'>Overview</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        <Card className='border-input'>
          <CardHeader>
            <CardTitle className='flex-between'>
              <span>Revenue</span>
              <HandCoinsIcon className='size-7' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-4xl font-semibold'>
            {formatCurrency(
              summary.totalSales._sum.totalPrice?.toString() || 0
            )}
          </CardContent>
        </Card>
        <Card className='border-input'>
          <CardHeader>
            <CardTitle className='flex-between'>
              <span>Sales</span>
              <CreditCardIcon className='size-7' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-4xl font-semibold'>
            {summary.ordersCount}
          </CardContent>
        </Card>
        <Card className='border-input'>
          <CardHeader>
            <CardTitle className='flex-between'>
              <span>Customers</span>
              <UsersIcon className='size-7' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-4xl font-semibold'>
            {summary.usersCount}
          </CardContent>
        </Card>
        <Card className='border-input'>
          <CardHeader>
            <CardTitle className='flex-between'>
              <span>Products</span>
              <ShirtIcon className='size-7' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-4xl font-semibold'>
            {summary.productsCount}
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <Card className='border-input'>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ sales: summary.sales }} />
          </CardContent>
        </Card>
        <Card className='border-input'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className='border-input hover:bg-inherit'>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='text-xs'>
                {summary.latestSales.map(
                  ({ id, user, createdAt, totalPrice }) => (
                    <TableRow key={id} className='border-input'>
                      <TableCell>{user.name || 'Deleted User'}</TableCell>
                      <TableCell>{formatDate(createdAt).dateAndTime}</TableCell>
                      <TableCell>{formatCurrency(+totalPrice)}</TableCell>
                      <TableCell>
                        <Link href={`/orders/${id}`}>Details</Link>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
