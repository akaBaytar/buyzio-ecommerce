'use client';

import Link from 'next/link';
import { useState } from 'react';

import ReviewForm from './review-form';

import type { Review } from '@/types';

type PropTypes = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewList = ({ productId, productSlug, userId }: PropTypes) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  return (
    <div className='space-y-2.5 mt-2.5'>
      {reviews.length === 0 && (
        <p className='leading-loose font-light text-pretty'>
          No reviews have been made yet; you could be the first to review this
          product.
        </p>
      )}
      {userId ? (
        <ReviewForm userId={userId} productId={productId} />
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
      <div className='flex flex-col gap-2.5'>REVIEWS HERE</div>
    </div>
  );
};

export default ReviewList;
