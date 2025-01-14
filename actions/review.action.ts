'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { auth } from '@/auth';
import prisma from '@/database';
import { handleError } from '@/lib/utils';
import { AddReviewSchema } from '@/schemas';

export const submitReview = async (data: z.infer<typeof AddReviewSchema>) => {
  try {
    const session = await auth();

    if (!session) throw new Error('User not authenticated.');

    const userId = session?.user?.id;

    const review = AddReviewSchema.parse({ ...data, userId });

    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error('Product not found.');

    const isReviewExist = await prisma.review.findFirst({
      where: { productId: review.productId, userId },
    });

    await prisma.$transaction(async (tx) => {
      if (isReviewExist) {
        await tx.review.update({
          where: { id: isReviewExist.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({ data: review });
      }

      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: { rating: averageRating._avg.rating || 0, numReviews },
      });
    });

    revalidatePath(`/products/${product.slug}`);

    return { success: true, message: 'Leaved a review successfully.' };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};

export const getReviews = async ({ productId }: { productId: string }) => {
  const data = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return { data };
};

export const getUserReview = async ({ productId }: { productId: string }) => {
  const session = await auth();

  if (!session) throw new Error('User not authenticated.');

  const userId = session.user?.id;

  return await prisma.review.findFirst({ where: { productId, userId } });
};

export const removeReview = async ({ id }: { id: string }) => {
  try {
    const session = await auth();

    if (!session) throw new Error('User not authenticated.');

    const userId = session.user?.id;

    await prisma.review.delete({ where: { id, userId } });

    return { success: true, message: 'Review removed successfully.' };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};
