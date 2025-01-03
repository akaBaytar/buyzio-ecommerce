import Link from 'next/link';
import Image from 'next/image';

import { StarIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

import type { Product } from '@prisma/client';
import type { ListTypes, PriceTypes } from '@/types';

export const ProductPrice = ({ value, className }: PriceTypes) => {
  const string = value.toFixed(2);
  const [int, float] = string.split('.');

  return (
    <p className={cn('text-2xl text-rose-500 font-bold', className)}>
      <span className='text-xs align-super font-normal'>$</span>
      {int}
      <span className='text-xs align-super'>.{float}</span>
    </p>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className='w-full max-w-sm mx-auto border-input bg-muted'>
      <CardHeader className='p-0 items-center'>
        <Link
          href={`/product/${product.slug}`}
          className='p-4 mt-4 bg-muted rounded-xl'>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority={true}
            className='block object-cover rounded-xl bg-muted'
          />
        </Link>
      </CardHeader>
      <CardContent className='p-4 grid gap-4'>
        <p className='text-xs line-clamp-1'>{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <CardTitle className='line-clamp-1'>{product.name}</CardTitle>
        </Link>
        <div className='flex-between gap-4'>
          <p className=' flex items-center gap-1 text-amber-500 text-sm font-semibold'>
            {product.rating.toString()}
            <StarIcon className='size-4 mb-0.5 fill-amber-500' />
          </p>
          {product.stock > 0 ? (
            <ProductPrice value={+product.price} />
          ) : (
            <p className='text-rose-500'>Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProductList = ({ products, title }: ListTypes) => {
  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-4 text-center sm:text-start'>{title}</h2>
      {products.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {products.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center sm:text-start'>
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
