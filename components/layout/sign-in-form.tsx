'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { EyeClosedIcon, EyeIcon, Loader2Icon } from 'lucide-react';

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
  const [passwordType, setPasswordType] = useState<'password' | 'text'>(
    'password'
  );

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

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
        <div className='space-y-1.5 relative'>
          <Label htmlFor='password'>Password:</Label>
          <Input
            id='password'
            name='password'
            type={passwordType}
            placeholder='Your password'
            defaultValue=''
            required
            className='p-2.5 text-sm transition-colors'
          />
          {passwordType === 'password' ? (
            <Button
              size='icon'
              type='button'
              variant='ghost'
              title='Show password'
              onClick={() => setPasswordType('text')}
              className='select-none size-5 p-1 absolute top-[50%] right-2 text-muted-foreground'>
              <EyeIcon />
            </Button>
          ) : (
            <Button
              size='icon'
              type='button'
              variant='ghost'
              title='Hide password'
              onClick={() => setPasswordType('password')}
              className='select-none size-5 p-1 absolute top-[50%] right-2 text-muted-foreground'>
              <EyeClosedIcon />
            </Button>
          )}
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
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
    </form>
  );
};

export default SignInForm;
