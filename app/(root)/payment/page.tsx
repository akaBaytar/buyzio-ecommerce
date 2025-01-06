import CheckoutSteps from '@/components/shared/checkout-steps';
import PaymentMethodForm from '@/components/shared/payment-form';

import { auth } from '@/auth';
import { getUser } from '@/actions/user.action';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Choose Payment Method',
};

const PaymentPage = async () => {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found.');

  const user = await getUser(userId);

  return (
    <>
      <CheckoutSteps currentStep='Payment Method' />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentPage;
