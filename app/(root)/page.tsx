import ProductList from '@/components/shared/product';

import { mockData } from '@/mock';

const HomePage = () => {
  return (
    <>
      <ProductList data={mockData.products} title='Newest Arrivals' limit={4} />
    </>
  );
};

export default HomePage;
