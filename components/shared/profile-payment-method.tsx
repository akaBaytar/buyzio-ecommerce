'use client';

import { useTransition } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Loader2Icon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '../ui/form';

import { useToast } from '@/hooks/use-toast';
import { PaymentMethodSchema } from '@/schemas';
import { updateUserPaymentMethod } from '@/actions/user.action';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/constants';

import type { PaymentMethod } from '@/types';

type PropType = {
  preferredPaymentMethod: string | null;
};

const ProfilePaymentMethod = ({ preferredPaymentMethod }: PropType) => {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: PaymentMethod) => {
    startTransition(async () => {
      const response = await updateUserPaymentMethod(values);

      toast({
        description: response.message,
      });
    });
  };

  const form = useForm<z.infer<typeof PaymentMethodSchema>>({
    resolver: zodResolver(PaymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD || 'Credit Card',
    },
  });

  return (
      <Form {...form}>
        <form
          method='post'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-5'>
          <div className='mt-5'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className='flex flex-col space-y-2.5'>
                      {PAYMENT_METHODS.map((method) => (
                        <FormItem
                          key={method}
                          className='flex items-center space-y-0 space-x-2.5'>
                          <FormControl>
                            <RadioGroupItem
                              value={method}
                              checked={field.value === method}
                            />
                          </FormControl>
                          <FormLabel className='cursor-pointer'>
                            {method}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' variant='secondary' disabled={isPending} className='w-full'>
            {isPending ? (
              <Loader2Icon className='size-4 animate-spin' />
            ) : (
              'Update Payment Method'
            )}
          </Button>
        </form>
      </Form>
  );
};

export default ProfilePaymentMethod;
