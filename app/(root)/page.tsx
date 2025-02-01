import ProductList from '@/components/shared/product';
import ProductCarousel from '@/components/shared/product-carousel';

import DealCountdown from '@/components/home/deal-countdown';

import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/actions/product.action';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel products={featuredProducts} />
      )}
      <ProductList products={latestProducts} title='Newest Arrivals' />
      <DealCountdown />
    </>
  );
};

export default HomePage;
