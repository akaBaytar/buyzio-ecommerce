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
