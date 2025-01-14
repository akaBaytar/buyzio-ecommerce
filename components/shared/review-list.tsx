'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { CalendarIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

import Rating from './rating';
import ReviewForm from './review-form';

import { formatDate } from '@/lib/utils';
import { getReviews } from '@/actions/review.action';

import type { Review } from '@/types';

type PropTypes = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewList = ({ productId, productSlug, userId }: PropTypes) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const response = await getReviews({ productId });

      setReviews(response.data);
    };

    loadReviews();
  }, [productId]);

  const onSubmitted = async () => {
    const response = await getReviews({ productId });

    setReviews([...response.data]);
  };

  return (
    <div className='space-y-2.5 mt-2.5'>
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onSubmitted={onSubmitted}
        />
      ) : (
        <p className='leading-loose font-light text-pretty'>
          Please{' '}
          <Link
            href={`/sign-in?callbackUrl=/products/${productSlug}`}
            className='underline hover:no-underline'>
            sign in
          </Link>{' '}
          to leave a review.
        </p>
      )}
      {reviews.length === 0 && (
        <p className='leading-loose font-light text-pretty'>
          No reviews have been made yet; you could be the first to review this
          product.
        </p>
      )}
      <div className='flex flex-col gap-2.5'>
        {reviews.map((review: Review) => (
          <Card key={review.id} className='border-input rounded-md'>
            <CardHeader>
              <div className='flex-between'>
                <CardTitle title={review.title} className='line-clamp-1'>
                  {review.title}
                </CardTitle>
                <Rating value={review.rating} />
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex-between text-xs text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Image
                    src={review.user.image || '/assets/user.png'}
                    width={32}
                    height={32}
                    alt={review.user.name}
                    className='rounded-md'
                  />
                  <p className='line-clamp-1'>
                    {review.user ? review.user.name : 'Anonymous'}
                  </p>
                </div>
                <div className='flex items-center gap-1'>
                  <CalendarIcon className='size-4' />
                  {formatDate(review.createdAt).dateAndTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
