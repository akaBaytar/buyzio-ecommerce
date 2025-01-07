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

export const createPayPalOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      await prisma.order.update({
        where: { id: orderId },
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
    } else {
      throw new Error('Order not found.');
    }
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const approvePayPalOrder = async (
  orderId: string,
  data: { orderID: string }
) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found.');

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment.');
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: 'Your order has been paid.',
    };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

export const updateOrderToPaid = async ({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });
  if (!order) throw new Error('Order not found.');

  if (order.isPaid) throw new Error('Order is already paid.');

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      });
    }

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });
};
