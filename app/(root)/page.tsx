import ProductList from '@/components/shared/product';

import { getLatestProducts } from '@/actions/product.action';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList products={latestProducts} title='Newest Arrivals' />
    </>
  );
};

export default HomePage;
