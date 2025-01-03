'use client';

import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className='space-y-5'>
      <Image
        src={images[current]}
        alt='Product Image'
        width={1000}
        height={1000}
        className='h-[34rem] object-contain border border-input bg-muted/20 rounded-xl shadow'
      />
      <div className='flex-center gap-5 p-5 border border-input rounded-xl shadow'>
        {images.map((image, idx) => (
          <div
            key={idx}
            role='button'
            onClick={() => setCurrent(idx)}
            className={cn(
              'border border-input rounded-xl p-2.5 cursor-pointer hover:border-foreground/50 transition-colors bg-muted/20',
              current === idx && 'border-foreground/50'
            )}>
            <Image
              src={image}
              alt='Product Image Thumbnail'
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
