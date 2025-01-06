import { UserIcon, TruckIcon, CreditCardIcon, CheckIcon } from 'lucide-react';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Buyzio';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;

export const CHECKOUT_STEPS = [
  { title: 'Authentication', icon: UserIcon },
  { title: 'Shipping Address', icon: TruckIcon },
  { title: 'Payment Method', icon: CreditCardIcon },
  { title: 'Place Order', icon: CheckIcon },
];

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['Credit Card', 'Cash on Delivery'];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD
  ? process.env.DEFAULT_PAYMENT_METHOD
  : 'Credit Card';
