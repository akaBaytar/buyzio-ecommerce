'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import prisma from '@/database';

import { CartItemSchema, CartSchema } from '@/schemas';
import { handleError, calculateTotal } from '@/lib/utils';

import type { CartItem } from '@/types';

export const getUserCart = async () => {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  if (!sessionCartId) throw new Error('Cart session not found.');

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return {
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: Number(cart.itemsPrice),
    taxPrice: Number(cart.taxPrice),
    shippingPrice: Number(cart.shippingPrice),
    totalPrice: Number(cart.totalPrice),
  };
};

export const addToCart = async (data: CartItem) => {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) throw new Error('Cart session not found.');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getUserCart();

    const cartItem = CartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: {
        id: cartItem.productId,
      },
    });

    if (!product) throw new Error('Product not found.');

    if (!cart) {
      const newCart = CartSchema.parse({
        userId,
        sessionCartId,
        items: [cartItem],
        ...calculateTotal([cartItem]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart successfully.`,
      };
    } else {
      const existingItem = cart.items.find(
        (i) => i.productId === cartItem.productId
      );

      if (existingItem) {
        if (product.stock < existingItem.qty + 1) {
          throw new Error('Insufficient stock.');
        }

        cart.items.find((i) => i.productId === cartItem.productId)!.qty =
          existingItem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error('Insufficient stock.');

        cart.items.push(cartItem);
      }

      await prisma.cart.update({
        where: {
          id: cart.id,
        },

        data: {
          items: cart.items,
          ...calculateTotal(cart.items),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existingItem ? 'updated in' : 'added to'
        } cart successfully.`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const removeFromCart = async (id: string) => {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) throw new Error('Cart session not found.');

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) throw new Error('Product not found.');

    const cart = await getUserCart();

    if (!cart) throw new Error('User cart not found.');

    const existingItem = cart.items.find((i) => i.productId === id);

    if (!existingItem) throw new Error('Cart item not found.');

    if (existingItem.qty === 1) {
      cart.items = cart.items.filter(
        (i) => i.productId !== existingItem.productId
      );
    } else {
      cart.items.find((i) => i.productId === id)!.qty = existingItem.qty - 1;
    }

    await prisma.cart.update({
      where: {
        id: cart.id,
      },

      data: {
        items: cart.items,
        ...calculateTotal(cart.items),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    const isLastItem = cart.items.find((i) => i.productId === id);

    return {
      success: true,
      message: `${product.name} ${
        isLastItem ? 'updated in' : 'removed from'
      } cart successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};
