import z from 'zod';

import {
  AddOrderSchema,
  CartItemSchema,
  AddReviewSchema,
  UpdateUserSchema,
  AddProductSchema,
  AddOrderItemSchema,
  UpdateProductSchema,
  PaymentResultSchema,
  PaymentMethodSchema,
  ShippingAddressSchema,
} from '@/schemas';

export type ListTypes = {
  products: Product[];
  title?: string;
};

export type PriceTypes = {
  value: number;
  className?: string;
};

export type Product = z.infer<typeof AddProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
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

export type OrderItem = z.infer<typeof AddOrderItemSchema>;

export type Order = z.infer<typeof AddOrderSchema> & {
  id: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};

export type PaymentResult = z.infer<typeof PaymentResultSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type AddProduct = z.infer<typeof AddProductSchema>;

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export type AddReview = z.infer<typeof AddReviewSchema> & {
  id: string;
  user?: { name: string; image?: string };
  createdAt: Date;
  updatedAt: Date;
};
