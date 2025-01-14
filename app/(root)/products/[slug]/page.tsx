import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import AddToCart from '@/components/shared/add-to-cart';
import ReviewList from '@/components/shared/review-list';
import { ProductPrice } from '@/components/shared/product';
import ProductImages from '@/components/shared/product-images';

import { auth } from '@/auth';

import { getUserCart } from '@/actions/cart.action';
import { getProductBySlug } from '@/actions/product.action';

import type { Product } from '@/types';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  return { title: product.name };
};

const ProductDetailsPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const cart = await getUserCart();
  const product: Product = await getProductBySlug(slug);

  const cartItem = {
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    image: product.images[0],
    productId: product.id,
    qty: 1,
  };

  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <section className='space-y-5'>
        <Breadcrumb>
          <BreadcrumbList className='text-xs'>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/products'>Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products?category=${product.category}`}>
                  {product.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products?query=${product.brand}`}>
                  {product.brand}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className='grid grid-cols-1 lg:grid-cols-5'>
          <div className='lg:col-span-2'>
            <ProductImages images={product.images} />
          </div>
          <div className='lg:col-span-2 p-5'>
            <div className='flex flex-col gap-2.5'>
              <p className='text-sm font-medium'>
                {product.brand} - {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>
              <p className='text-sm'>
                {product.rating.toString()} of {product.numReviews} reviews
              </p>
              <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center'>
                <ProductPrice
                  value={Number(product.price)}
                  className='mt-2.5 rounded-xl bg-muted text-foreground px-5 pt-2.5 pb-1.5 max-w-fit shadow'
                />
              </div>
            </div>
            <div className='mt-5'>
              <p className='font-semibold'>Description</p>
              <p className='leading-loose font-light text-pretty'>
                {product.description}
              </p>
            </div>
          </div>
          <div className='lg:col-span-1'>
            <Card className='border-input'>
              <CardContent className='p-5'>
                <div className='mb-2.5 flex justify-between'>
                  <p>Price</p>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className='mb-2.5 flex justify-between'>
                  <p>Status</p>
                  {product.stock > 0 ? (
                    <Badge variant='secondary'>In Stock</Badge>
                  ) : (
                    <Badge
                      variant='secondary'
                      className='bg-rose-500 hover:bg-rose-500'>
                      Out of Stock
                    </Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className='flex-center'>
                    <AddToCart item={cartItem} cart={cart} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className='my-5 p-5 border border-input rounded-md bg-muted/20'>
        <h2 className='h3-bold'>Customer Reviews</h2>
        <ReviewList
          productId={product.id}
          userId={userId as string}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
