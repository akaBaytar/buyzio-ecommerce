'use client';

import Link from 'next/link';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { APP_NAME } from '@/constants';

const SignInForm = () => {
  return (
    <form>
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
            autoComplete='current-password'
            placeholder='Your password'
            defaultValue=''
            required
            className='p-2.5 text-sm transition-colors'
          />
        </div>
        <Button size='lg' className='w-full'>
          Sign In
        </Button>
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
