'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Loader2Icon } from 'lucide-react';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { APP_NAME } from '@/constants';

import { signInUser } from '@/actions/user.action';

const SignInButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button size='lg' disabled={pending} className='w-full'>
      {pending ? <Loader2Icon className='size-4 animate-spin' /> : 'Sign In'}
    </Button>
  );
};

const SignInForm = () => {
  const defaultState = {
    success: false,
    message: '',
  };

  const [data, action] = useActionState(signInUser, defaultState);

  return (
    <form action={action}>
      <div className='space-y-5'>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email:</Label>
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            placeholder='Your email address'
            defaultValue=''
            required
            className='p-2.5 text-sm transition-colors'
          />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='password'>Password:</Label>
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='Your password'
            defaultValue=''
            required
            className='p-2.5 text-sm transition-colors'
          />
        </div>
        <SignInButton />
        {data && !data.success && (
          <p className='text-center text-xs text-rose-500'>{data.message}</p>
        )}
        <div className='text-center text-xs text-muted-foreground'>
          Don&apos;t have a {APP_NAME} account?
          <Link href='/sign-up' target='_self' className='ms-1 underline'>
            Create a account
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
