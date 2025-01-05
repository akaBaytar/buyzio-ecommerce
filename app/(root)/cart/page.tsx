import CartTable from '@/components/shared/cart-table';

import { getUserCart } from '@/actions/cart.actions';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
};

const CartPage = async () => {
  const cart = await getUserCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
