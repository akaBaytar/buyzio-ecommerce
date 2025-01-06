import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';

import { formatCurrency, formatDate, formatID } from '@/lib/utils';
import { getOrders } from '@/actions/order.action';

import type { Order } from '@/types';

const OrdersPage = async () => {
  const orders = await getOrders();

  return (
    <>
      <h1 className='my-5 h2-bold'>Orders</h1>
      <Table>
        <TableHeader>
          <TableRow className='border-input hover:bg-inherit'>
            <TableHead className='min-w-[16ch]'>Order ID</TableHead>
            <TableHead className='min-w-[16ch]'>Ordered At</TableHead>
            <TableHead className='min-w-[16ch]'>Payment Method</TableHead>
            <TableHead className='min-w-[16ch]'>Total Price</TableHead>
            <TableHead className='min-w-[16ch]'>Payment Status</TableHead>
            <TableHead className='min-w-[16ch]'>Delivered</TableHead>
            <TableHead className='min-w-[16ch]'>Shipping Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: Order) => (
            <TableRow key={order.id} className='text-xs border-input'>
              <TableCell title={order.id}>
                <Link href={`/orders/${order.id}`}>{formatID(order.id)}</Link>
              </TableCell>
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
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>End of Orders</TableCaption>
      </Table>
    </>
  );
};

export default OrdersPage;
