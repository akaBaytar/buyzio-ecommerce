'use client';

import Link from 'next/link';
import Image from 'next/image';

import autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

import type { Product } from '@/types';

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        autoplay({
          delay: 5000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
      className='w-full'>
      <CarouselContent>
        {products.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/products/${product.slug}`}>
              <div className='relative mx-auto'>
                <Image
                  priority
                  src={product.banner as string}
                  alt={product.name}
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-auto max-h-[35rem] w-full object-cover border border-input rounded-md bg-muted/20'
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ProductCarousel;
