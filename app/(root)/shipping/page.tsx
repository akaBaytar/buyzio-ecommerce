import { redirect } from 'next/navigation';

import CheckoutSteps from '@/components/shared/checkout-steps';
import ShippingAddressForm from '@/components/shared/shipping-form';

import { auth } from '@/auth';
import { getUser } from '@/actions/user.action';
import { getUserCart } from '@/actions/cart.action';

import type { Metadata } from 'next';
import type { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingPage = async () => {
  const cart = await getUserCart();

  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('No user ID.');

  const user = await getUser(userId);

  return (
    <>
      <CheckoutSteps currentStep='Shipping Address' />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingPage;
