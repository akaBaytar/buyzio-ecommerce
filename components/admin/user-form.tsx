'use client';

import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Loader2Icon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import { USER_ROLES } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/actions/admin.action';
import { UpdateUserDetailsSchema } from '@/schemas';

import type { User } from '@/types';

const UpdateUserForm = ({ user }: { user: User }) => {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateUserDetailsSchema>>({
    resolver: zodResolver(UpdateUserDetailsSchema),
    defaultValues: user,
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof UpdateUserDetailsSchema>) => {
    const response = await updateUser(values);

    if (response.success) {
      toast({ description: response.message });

      router.push('/admin/users');
    } else {
      toast({ description: response.message });
    }
  };

  return (
    <Form {...form}>
      <form method='POST' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-5'>
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>ID:</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className='text-sm' />
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
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      disabled
                      className='text-sm'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter customer name'
                      className='text-sm'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Role:</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select user role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='border-input'>
                      {USER_ROLES.map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className='cursor-pointer'>
                          {role.charAt(0).toUpperCase()}
                          {role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type='submit' className='w-full my-5' disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2Icon className='size-4 animate-spin' />
          ) : (
            'Update User'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
