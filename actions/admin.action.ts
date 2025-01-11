'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/database';
import { handleError } from '@/lib/utils';
import { utapi } from '@/server/uploadthing';
import { updateOrderAsPaid } from '@/actions/order.action';
import { AddProductSchema, UpdateProductSchema } from '@/schemas';

import type { Prisma } from '@prisma/client';
import type { AddProduct, UpdateProduct } from '@/types';

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

export const addProduct = async (data: AddProduct) => {
  try {
    const product = AddProductSchema.parse(data);

    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: handleError('Product added successfully.'),
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const updateProduct = async (data: UpdateProduct) => {
  try {
    const product = UpdateProductSchema.parse(data);

    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!updatedProduct) throw new Error('Product not found.');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: handleError('Product updated successfully.'),
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const removeProduct = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) throw new Error('Product not found.');

    const images = product.images;

    const imageIds = images.map((url: string) => url.split('/').pop());

    await utapi.deleteFiles(imageIds as string[]);

    await prisma.product.delete({ where: { id: product.id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product removed successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};
