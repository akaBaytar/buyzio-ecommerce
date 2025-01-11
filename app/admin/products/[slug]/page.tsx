import { getProductBySlug } from '@/actions/product.action';
import ProductForm from '@/components/admin/product-form';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Product Details',
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ProductUpdatePage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  return (
    <div className='space-y-5'>
      <h1 className='h2-bold'>Update Product Details</h1>
      <ProductForm
        type='Update Product'
        product={product}
        productId={product.id}
        productImages={product.images}
      />
    </div>
  );
};

export default ProductUpdatePage;
