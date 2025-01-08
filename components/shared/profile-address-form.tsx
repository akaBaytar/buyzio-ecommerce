'use client';

import { useTransition } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Loader2Icon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '../ui/form';

import { useToast } from '@/hooks/use-toast';
import { ShippingAddressSchema } from '@/schemas';
import { updateUserAddress } from '@/actions/user.action';

import type { ShippingAddress } from '@/types';
import type { ControllerRenderProps, SubmitHandler } from 'react-hook-form';

const ProfileAddressForm = ({ address }: { address: ShippingAddress }) => {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const defaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
  };

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: address || defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof ShippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const response = await updateUserAddress(values);

      toast({
        description: response.message,
      });
    });
  };

  type NameField = {
    field: ControllerRenderProps<
      z.infer<typeof ShippingAddressSchema>,
      'fullName'
    >;
  };

  type AddressField = {
    field: ControllerRenderProps<
      z.infer<typeof ShippingAddressSchema>,
      'streetAddress'
    >;
  };

  type CityField = {
    field: ControllerRenderProps<z.infer<typeof ShippingAddressSchema>, 'city'>;
  };

  type CountryField = {
    field: ControllerRenderProps<
      z.infer<typeof ShippingAddressSchema>,
      'country'
    >;
  };

  type PostalCodeField = {
    field: ControllerRenderProps<
      z.infer<typeof ShippingAddressSchema>,
      'postalCode'
    >;
  };

  return (
    <div className='space-y-5'>
      <Form {...form}>
        <form
          method='post'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-5'>
          <div className='flex flex-col lg:flex-row gap-5'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }: NameField) => (
                <FormItem className='w-full'>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your full name'
                      autoComplete='name'
                      className='text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-5'>
            <FormField
              control={form.control}
              name='streetAddress'
              render={({ field }: AddressField) => (
                <FormItem className='w-full'>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your address'
                      autoComplete='street-address'
                      className='text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-5'>
            <FormField
              control={form.control}
              name='city'
              render={({ field }: CityField) => (
                <FormItem className='w-full'>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your city'
                      autoComplete='address-level1'
                      className='text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-5'>
            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }: PostalCodeField) => (
                <FormItem className='w-full'>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter postal code'
                      autoComplete='postal-code'
                      className='text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col lg:flex-row gap-5'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }: CountryField) => (
                <FormItem className='w-full'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your country'
                      autoComplete='country'
                      className='text-sm'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type='submit'
            variant='secondary'
            disabled={isPending}
            className='w-full'>
            {isPending ? (
              <Loader2Icon className='size-4 animate-spin' />
            ) : (
              'Update Shipping Address'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileAddressForm;
