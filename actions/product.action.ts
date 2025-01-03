'use server';

import { notFound } from 'next/navigation';

import prisma from '@/database';
import { LATEST_PRODUCTS_LIMIT } from '@/constants';

export const getLatestProducts = async () => {
  const latestProducts = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return latestProducts;
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  return product;
};
