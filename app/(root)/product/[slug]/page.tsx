import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import AddToCart from '@/components/shared/add-to-cart';
import { ProductPrice } from '@/components/shared/product';
import ProductImages from '@/components/shared/product-images';

import { getUserCart } from '@/actions/cart.actions';
import { getProductBySlug } from '@/actions/product.action';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ProductDetailsPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const cart = await getUserCart();
  const product = await getProductBySlug(slug);

  const cartItem = {
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    image: product.images[0],
    productId: product.id,
    qty: 1,
  };

  return (
    <>
      <section>
        <div className='grid grid-cols-1 lg:grid-cols-5'>
          <div className='col-span-2'>
            <ProductImages images={product.images} />
          </div>
          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-5'>
              <p>
                {product.brand} - {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>
              <p className='text-sm'>
                {product.rating.toString()} of {product.numReviews} reviews
              </p>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <ProductPrice
                  value={Number(product.price)}
                  className='mt-5 rounded-xl bg-muted text-foreground px-5 pt-2.5 pb-1.5 max-w-fit shadow'
                />
              </div>
            </div>
            <div className='mt-10'>
              <p className='font-semibold'>Description</p>
              <p className='leading-loose font-light text-pretty'>
                {product.description}
              </p>
            </div>
          </div>
          <div>
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
    </>
  );
};

export default ProductDetailsPage;
