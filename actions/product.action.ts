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

  return JSON.parse(JSON.stringify(latestProducts));
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) notFound();

  return JSON.parse(JSON.stringify(product));
};

export const getAllProducts = async ({
  query,
  limit,
  page,
  category,
}: GetAllProducts) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ],
      ...(category && { category: { equals: category } }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * (limit || 10),
  });

  const productCount = products.length;

  const totalPages = Math.ceil(productCount / (limit || 10));

  return {
    totalPages,
    productCount,
    products: JSON.parse(JSON.stringify(products)),
  };
};

export const getAllCategories = async () => {
  return await prisma.product.groupBy({ by: ['category'], _count: true });
};

export const getFeaturedProducts = async () => {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return JSON.parse(JSON.stringify(featuredProducts));
};
