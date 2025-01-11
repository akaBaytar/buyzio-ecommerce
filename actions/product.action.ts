'use server';

import { notFound } from 'next/navigation';

import prisma from '@/database';
import { LATEST_PRODUCTS_LIMIT } from '@/constants';

type GetAllProducts = {
  query: string;
  page: number;
  limit?: number;
  category?: string;
};

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

export const getAllProducts = async ({
  query,
  limit,
  page,
  category,
}: GetAllProducts) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * (limit || 10),
  });

  const productCount = await prisma.product.count();

  const totalPages = Math.ceil(productCount / (limit || 10));

  return {
    totalPages,
    productCount,
    products: JSON.parse(JSON.stringify(products)),
  };
};
