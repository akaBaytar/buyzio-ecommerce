'use server';

import prisma from '@/database';
import { LATEST_PRODUCTS_LIMIT } from '@/constants';

export const getLatestProducts = async () => {
  const latestProducts = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return latestProducts;
};
