'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import slugify from 'slugify';
import { Loader2Icon } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import { useToast } from '@/hooks/use-toast';
import { AddProductSchema, UpdateProductSchema } from '@/schemas';
import { addProduct, updateProduct } from '@/actions/admin.action';

import type { AddProduct, Product } from '@/types';

type PropTypes = {
  type: 'Add Product' | 'Update Product';
  product?: Product;
  productId?: string;
};

const ProductForm = ({ type, product, productId }: PropTypes) => {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver:
      type === 'Add Product'
        ? zodResolver(AddProductSchema)
        : zodResolver(UpdateProductSchema),
    defaultValues:
      product && type === 'Update Product'
        ? product
        : {
            name: '',
            banner: null,
            brand: '',
            category: '',
            description: '',
            images: [],
            isFeatured: false,
            price: 0,
            stock: 0,
            slug: '',
          },
  });

  const name = useWatch({ control: form.control, name: 'name' });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (name) {
      form.setValue('slug', slugify(name, { lower: true }));
    } else {
      form.setValue('slug', '');
    }
  }, [name, form]);

  const onSubmit = async (values: AddProduct) => {
    if (type === 'Add Product') {
      const response = await addProduct(values);

      toast({ description: response.message });

      router.push(`/product/${values.slug}`);
    }

    if (type === 'Update Product') {
      if (!productId) {
        router.push('/admin/products');
      } else {
        const response = await updateProduct({ ...values, id: productId });

        toast({ description: response.message });

        router.push(`/admin/products`);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-5'>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Product Name:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter product name'
                    className='text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Product Slug:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    placeholder='Generate product slug'
                    className='text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder='Enter product description'
                  className='text-sm resize-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter category'
                    className='text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter brand'
                    className='text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Price:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    min={0}
                    step={5}
                    className='text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='stock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    min={0}
                    step={5}
                    className='text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting ? (
            <Loader2Icon className='size-4 animate-spin' />
          ) : (
            type
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
