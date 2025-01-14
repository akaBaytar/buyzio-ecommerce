import Link from 'next/link';

import {
  FilterXIcon,
  ArrowUp10Icon,
  ArrowDown10Icon,
  ArrowDownAZIcon,
  ArrowDownZAIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';

import { ProductCard } from '@/components/shared/product';

import { cn } from '@/lib/utils';
import { getAllCategories, getAllProducts } from '@/actions/product.action';

import type { Product } from '@/types';

type PageProps = {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    query?: string;
    price?: string;
    rating?: string;
    category?: string;
  }>;
};

type ParamTypes = {
  c?: string;
  s?: string;
  p?: string;
  r?: string;
  pg?: string;
};

type MetadataProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export const generateMetadata = async ({ searchParams }: MetadataProps) => {
  const { category = 'all' } = await searchParams;

  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';

  if (isCategorySet) return { title: category };

  return { title: 'All Products' };
};

const ProductsPage = async ({ searchParams }: PageProps) => {
  const {
    page = '1',
    price = 'all',
    query = 'all',
    rating = 'all',
    sort = 'newest',
    category = 'all',
  } = await searchParams;

  const { products } = await getAllProducts({
    sort,
    query,
    price,
    rating,
    category,
    page: +page,
  });

  const categories = await getAllCategories();

  const prices = [
    { name: '$1 - $50', value: '1-50' },
    { name: '$51 - $100', value: '51-100' },
    { name: '$101 - $200', value: '101-200' },
    { name: '$201 - $500', value: '201-500' },
  ];

  const ratings = [4, 3, 2, 1];

  const sorting = [
    {
      name: 'newest',
      title: 'Sort by newest products',
      icon: <ArrowUpNarrowWideIcon />,
    },
    {
      name: 'lowest',
      title: 'Sort by lowest price',
      icon: <ArrowDown10Icon />,
    },
    {
      name: 'highest',
      title: 'Sort by highest price',
      icon: <ArrowUp10Icon />,
    },
    {
      name: 'rating',
      title: 'Sort by product ratings',
      icon: <ArrowUpDownIcon />,
    },
    {
      name: 'last',
      title: 'Sort by product names',
      icon: <ArrowDownAZIcon />,
    },
    {
      name: 'first',
      title: 'Sort by product names',
      icon: <ArrowDownZAIcon />,
    },
  ];

  const filterURL = ({ c, s, p, r, pg }: ParamTypes) => {
    const params = { sort, query, price, rating, category, page };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/products?${new URLSearchParams(params).toString()}`;
  };

  return (
    <>
      <h1 className='h2-bold py-5'>Products</h1>
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-8'>
        <div className='lg:col-span-2'>
          <div className='space-y-5 bg-muted/20 p-5 rounded-xl border border-input shadow-lg'>
            <Accordion type='single' collapsible>
              <AccordionItem
                value='categories'
                className='rounded-xl border border-input px-3 py-2 text-sm shadow-md'>
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <Link
                    href={filterURL({ c: 'all' })}
                    className={cn(
                      'block p-1.5 mt-1 rounded-sm',
                      (category === 'all' || category === '') && 'bg-muted'
                    )}>
                    All Categories
                  </Link>
                </AccordionContent>
                {categories.map((c) => (
                  <AccordionContent key={c.category}>
                    <Link
                      href={filterURL({ c: c.category })}
                      className={cn(
                        'block p-1.5 mt-1 rounded-sm',
                        category === c.category && 'bg-muted'
                      )}>
                      {c.category}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
            <Accordion type='single' collapsible>
              <AccordionItem
                value='categories'
                className='rounded-xl border border-input px-3 py-2 text-sm shadow-md'>
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                  <Link
                    href={filterURL({ p: 'all' })}
                    className={cn(
                      'block p-1.5 mt-1 rounded-sm',
                      (price === 'all' || price === '') && 'bg-muted'
                    )}>
                    All Prices
                  </Link>
                </AccordionContent>
                {prices.map(({ name, value }) => (
                  <AccordionContent key={name}>
                    <Link
                      href={filterURL({ p: value })}
                      className={cn(
                        'block p-1.5 mt-1 rounded-sm',
                        price === value && 'bg-muted'
                      )}>
                      {name}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
            <Accordion type='single' collapsible>
              <AccordionItem
                value='categories'
                className='rounded-xl border border-input px-3 py-2 text-sm shadow-md'>
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                  <Link
                    href={filterURL({ r: 'all' })}
                    className={cn(
                      'block p-1.5 mt-1 rounded-sm',
                      (rating === 'all' || rating === '') && 'bg-muted'
                    )}>
                    All Ratings
                  </Link>
                </AccordionContent>
                {ratings.map((r) => (
                  <AccordionContent key={r}>
                    <Link
                      href={filterURL({ r: r.toString() })}
                      className={cn(
                        'block p-1.5 mt-1 rounded-sm',
                        rating === r.toString() && 'bg-muted'
                      )}>
                      {r === 1 ? `${r} star & up` : `${r} stars & up`}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className='space-y-5 lg:col-span-6'>
          <div className='flex-between flex-col sm:flex-row mb-5 gap-5 border border-input bg-muted/20 shadow-md rounded-xl text-sm p-5'>
            <div className='flex-center sm:justify-start w-full'>
              {(query !== 'all' && query !== '') ||
              (category !== 'all' && category !== '') ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button
                  asChild
                  variant='outline'
                  title='Clear all filters'
                  className='w-[256px]'>
                  <Link href='/products'>
                    <FilterXIcon />
                    Clear All Filter
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  variant='outline'
                  title='Clear all filters'
                  className='w-[256px]'>
                  <FilterXIcon />
                  Clear All Filter
                </Button>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {sorting.map(({ icon, name, title }) => (
                <Button
                  asChild
                  key={name}
                  title={title}
                  variant={sort === name ? 'default' : 'outline'}
                  size='icon'>
                  <Link href={filterURL({ s: name })}>{icon}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
            {products.length === 0 && (
              <p className='text-sm'>No products found.</p>
            )}
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
