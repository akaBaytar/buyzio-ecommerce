'use server';

import { notFound } from 'next/navigation';

import prisma from '@/database';
import { Prisma } from '@prisma/client';
import { LATEST_PRODUCTS_LIMIT } from '@/constants';

type GetAllProducts = {
  query: string;
  page: number;
  sort?: string;
  limit?: number;
  price?: string;
  rating?: string;
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
  sort,
  query,
  limit,
  price,
  rating,
  category,
  page = 1,
}: GetAllProducts) => {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { brand: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};

  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]) || 9999,
          },
        }
      : {};

  const ratingFilter =
    rating && rating !== 'all' ? { rating: { gte: +rating } } : {};

  const products = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : sort === 'first'
        ? { name: 'desc' }
        : sort === 'last'
        ? { name: 'asc' }
        : { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * (limit || 10),
  });

  const productCount = await prisma.product.count({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
  });

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
