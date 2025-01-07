'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/database';

import { auth } from '@/auth';
import { paypal } from '@/lib/paypal';
import { handleError } from '@/lib/utils';
import { AddOrderSchema } from '@/schemas';

import { getUser } from './user.action';
import { getUserCart } from './cart.actions';

import type { CartItem, PaymentResult } from '@/types';

type Parameters = {
  id: string;
  paymentResult?: PaymentResult;
};

export const createOrder = async () => {
  try {
    const session = await auth();

    if (!session) throw new Error('Session not found.');

    const cart = await getUserCart();

    const userId = session.user?.id;

    if (!userId) throw new Error('User not found.');

    const user = await getUser(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Shopping cart is empty.',
        redirectTo: '/cart',
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: 'No shipping address.',
        redirectTo: '/shipping',
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'No payment method.',
        redirectTo: '/payment',
      };
    }

    const order = AddOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const createdOrderId = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({ data: order });

      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: { ...item, orderId: createdOrder.id, price: item.price },
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        },
      });

      return createdOrder.id;
    });

    if (!createdOrderId) throw new Error('Order not created.');

    return {
      success: true,
      message: 'Order created successfully.',
      redirectTo: `/orders/${createdOrderId}`,
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const getOrder = async (id: string) => {
  const session = await auth();

  if (!session) throw new Error('Session not found.');

  const userId = session.user?.id;

  const order = await prisma.order.findUnique({
    where: { id, userId },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return JSON.parse(JSON.stringify(order));
};

export const getOrders = async () => {
  try {
    const session = await auth();

    if (!session) throw new Error('Session not found.');

    const userId = session.user?.id;

    if (!userId) throw new Error('User not found.');

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const createPaypalOrder = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) throw new Error('Order not found.');

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

    await prisma.order.update({
      where: { id },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          email_address: '',
          status: '',
          pricePaid: 0,
        },
      },
    });

    return {
      success: true,
      message: 'Order created successfully.',
      data: paypalOrder.id,
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const confirmPaypalOrder = async (
  id: string,
  data: { orderId: string }
) => {
  try {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) throw new Error('Order not found.');

    const capturedData = await paypal.capturePayment(data.orderId);

    if (
      !capturedData ||
      capturedData.id !== (order.paymentResult as PaymentResult).id ||
      capturedData.status !== 'COMPLETED'
    ) {
      throw new Error('An error occurred during the PayPal payment.');
    }

    await updateOrderAsPaid({
      id,
      paymentResult: {
        id: capturedData.id,
        status: capturedData.status,
        email_address: capturedData.payer.email_address,
        pricePaid:
          capturedData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/orders/${id}`);

    return {
      success: true,
      message: handleError('PayPal payment completed successfully.'),
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

const updateOrderAsPaid = async ({ id, paymentResult }: Parameters) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: true },
  });

  if (!order) throw new Error('Order not found.');

  if (order.isPaid) throw new Error('Order is paid already.');

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    await tx.order.update({
      where: { id },
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
  });

  const updatedOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found.');
};
