'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@prisma/client';

import prisma from '@/database';
import { handleError } from '@/lib/utils';
import { updateOrderAsPaid } from '@/actions/order.action';

type GetAllOrders = {
  page: number;
  limit?: number;
};

export const getSummary = async () => {
  const usersCount = await prisma.user.count();
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();

  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  const salesRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const sales = salesRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
    take: 6,
  });

  return {
    usersCount,
    ordersCount,
    productsCount,
    totalSales,
    sales,
    latestSales,
  };
};

export const getAllOrders = async ({ page, limit }: GetAllOrders) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * (limit || 10),
    include: { user: { select: { name: true } } },
  });

  const orderCount = await prisma.order.count();

  const totalPages = Math.ceil(orderCount / (limit || 10));

  return {
    totalPages,
    orderCount,
    orders: JSON.parse(JSON.stringify(orders)),
  };
};

export const removeOrder = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) throw new Error('Order not found.');

    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { orderId: order.id },
      }),

      prisma.order.delete({
        where: { id: order.id },
      }),
    ]);

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order removed successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const markOrderAsPaid = async (id: string) => {
  try {
    await updateOrderAsPaid({ id });

    revalidatePath(`/orders/${id}`);

    return {
      success: true,
      message: 'Order updated as paid successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const markOrderAsDelivered = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) throw new Error('Order not found.');

    if (!order.isPaid) throw new Error('Order is not paid.');

    await prisma.order.update({
      where: { id: order.id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/orders/${order.id}`);

    return {
      success: true,
      message: 'Order updated as delivered successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};
