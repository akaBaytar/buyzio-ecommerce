'use client';

import Link from 'next/link';
import Image from 'next/image';

import autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

import type { Product } from '@/types';

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <section>
      <Carousel
        opts={{ loop: true }}
        plugins={[
          autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
        className='w-full mt-5'>
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
                    className='h-auto min-h-96 w-full object-cover rounded-md'
                  />
                  <div className='absolute bottom-5 start-5 end-5 lg:start-10 lg:end-10 lg:bottom-10 text-white'>
                    <h2 className='text-2xl bg-black/30 p-5 rounded-lg leading-normal font-extralight tracking-wide lg:text-4xl lg:leading-relaxed lg:p-10 text-pretty'>
                      Seasonal Specials
                      <br /> Hot deals for a limited time!
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
