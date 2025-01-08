'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Loader2Icon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import { UpdateUserSchema } from '@/schemas';
import { updateUser } from '@/actions/user.action';

import type { UpdateUser } from '@/types';

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: UpdateUser) => {
    const response = await updateUser(values);

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
        email: values.email,
      },
    };

    await update(newSession);

    toast({ description: response.message });
  };

  return (
    <Form {...form}>
      <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className='font-semibold'>User Information</h2>
        <div className='space-y-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter your full name'
                    autoComplete='name'
                    className='p-5 text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Enter your email address'
                    autoComplete='email'
                    className='p-5 text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='******'
                    autoComplete='none'
                    className='p-5 text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='password'
                    placeholder='******'
                    autoComplete='none'
                    className='p-5 text-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {}
        <Button
          type='submit'
          variant='secondary'
          disabled={form.formState.isSubmitting}
          className='w-full'>
          {form.formState.isSubmitting ? (
            <Loader2Icon className='size-4' />
          ) : (
            'Update Information'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
