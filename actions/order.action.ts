'use server';

import prisma from '@/database';

import { auth } from '@/auth';
import { handleError } from '@/lib/utils';
import { AddOrderSchema } from '@/schemas';

import { getUser } from './user.action';
import { getUserCart } from './cart.actions';

import type { CartItem } from '@/types';

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
  const order = await prisma.order.findUnique({
    where: { id },
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
