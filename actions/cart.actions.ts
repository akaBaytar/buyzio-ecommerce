'use server';

import { cookies } from 'next/headers';

import { handleError } from '@/lib/utils';

import type { CartItem } from '@/types';

export const addToCart = async (data: CartItem) => {
  try {
    return {
      success: true,
      message: 'Product added to cart successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};
