import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';
import type { CartItem } from '@/types';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (error: any) => {
  if (isRedirectError(error)) throw error;

  if (error.name === 'ZodError') {
    return error.errors[0].message;
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
};

export const roundNumbers = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not valid.');
  }
};

export const calculateTotal = (items: CartItem[]) => {
  const itemsPrice = roundNumbers(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );

  const shippingPrice = roundNumbers(itemsPrice > 100 ? 0 : 12.99);
  const taxPrice = roundNumbers(0.18 * itemsPrice);

  const totalPrice = roundNumbers(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
};
