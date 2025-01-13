import { ProductCard } from '@/components/shared/product';

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
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-5'>
        <div className='lg:col-span-1'>FILTER</div>
        <div className='space-y-5 lg:col-span-4'>
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
