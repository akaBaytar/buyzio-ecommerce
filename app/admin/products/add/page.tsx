import ProductForm from '@/components/admin/product-form';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Product',
};

const AddProductPage = () => {
  return (
    <>
      <h1 className='h2-bold'>Add Product</h1>
      <div className='my-5'>
        <ProductForm type='Add Product' />
      </div>
    </>
  );
};

export default AddProductPage;
