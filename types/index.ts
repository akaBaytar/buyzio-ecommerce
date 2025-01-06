import z from 'zod';

import {
  CartItemSchema,
  PaymentMethodSchema,
  ShippingAddressSchema,
} from '@/schemas';

import type { Product } from '@prisma/client';

export type ListTypes = {
  products: Product[];
  title?: string;
};

export type PriceTypes = {
  value: number;
  className?: string;
};

export type User = {
  id: string;
  role: string;
  name?: string;
  email?: string;
  password?: string;
};

export type CartItem = z.infer<typeof CartItemSchema>;

export type Cart = {
  items: CartItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  sessionCartId: string;
};

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export type CheckoutSteps =
  | 'Authentication'
  | 'Shipping Address'
  | 'Payment Method'
  | 'Place Order';

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
