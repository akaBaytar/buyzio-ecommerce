import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import Rating from './rating';

import { cn } from '@/lib/utils';

import type { ListTypes, PriceTypes, Product } from '@/types';

export const ProductPrice = ({ value, className }: PriceTypes) => {
  const string = value.toFixed(2);
  const [int, float] = string.split('.');

  return (
    <p className={cn('text-2xl font-bold', className)}>
      <span className='text-xs align-super font-normal'>$</span>
      {int}
      <span className='text-xs align-super'>.{float}</span>
    </p>
  );
};

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className='w-full  mx-auto border-input bg-muted/20'>
      <CardHeader className='p-0 items-center'>
        <Link
          href={`/products/${product.slug}`}
          className='p-4 mt-4 rounded-xl'>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority={true}
            className='block object-cover rounded-xl'
          />
        </Link>
      </CardHeader>
      <CardContent className='p-5 grid gap-2.5'>
        <p className='text-xs line-clamp-1'>{product.brand}</p>
        <Link href={`/products/${product.slug}`}>
          <CardTitle className='line-clamp-1'>{product.name}</CardTitle>
        </Link>
        <div className='flex-between gap-5'>
          <Rating value={+product.rating} />
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
    <section className='mt-20'>
      <h2 className='h2-bold mb-1 text-center sm:text-start'>{title}</h2>
      <p className='mb-4 text-sm font-light text-center sm:text-start'>
        Shop the latest additions fresh in stock
      </p>
      {products.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {products.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center sm:text-start'>
          <p className='text-sm'>No products found.</p>
        </div>
      )}
    </section>
  );
};

export default ProductList;
