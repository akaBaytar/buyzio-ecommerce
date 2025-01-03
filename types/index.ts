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
