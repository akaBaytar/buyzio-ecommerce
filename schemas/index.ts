import { z } from 'zod';

export const AddProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters.'),
  category: z.string().min(3, 'Category must be at least 3 characters.'),
  brand: z.string().min(3, 'Brand must be at least 3 characters.'),
  description: z
    .string()
    .min(30, 'Description must be at least 30 characters.'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have at least one image.'),
  isFeatured: z.boolean(),
  banner: z.optional(z.string()),
  price: z.number(),
});

export const SignInFormSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const SignUpFormSchema = z
  .object({
    name: z.string().min(1, 'Name must be at least one character.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required.'),
  name: z.string().min(1, 'Name is required.'),
  slug: z.string().min(1, 'Slug is required.'),
  qty: z.number().int().nonnegative('Quantity must be a positive number.'),
  image: z.string().min(1, 'Image is required.'),
  price: z.number(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  itemsPrice: z.number(),
  shippingPrice: z.number(),
  taxPrice: z.number(),
  totalPrice: z.number(),
  sessionCartId: z.string().min(1, 'Session cart ID is required.'),
  userId: z.string().optional().nullable(),
});

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Name must be at least one character.'),
  streetAddress: z
    .string()
    .min(1, 'Street name must be at least one character.'),
  city: z.string().min(1, 'City name must be at least one character.'),
  postalCode: z.string().min(5, 'Postal Code must be at least 5 characters.'),
  country: z.string().min(3, 'Country name must be at least 3 characters.'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
