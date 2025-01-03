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

import { signUpUser } from '@/actions/user.action';

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button size='lg' disabled={pending} className='w-full'>
      {pending ? <Loader2Icon className='size-4 animate-spin' /> : 'Register'}
    </Button>
  );
};

const SignUpForm = () => {
  const [passwordType, setPasswordType] = useState<'password' | 'text'>(
    'password'
  );

  const [confirmPasswordType, setConfirmPasswordType] = useState<
    'password' | 'text'
  >('password');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const defaultState = {
    success: false,
    message: '',
  };

  const [data, action] = useActionState(signUpUser, defaultState);

  return (
    <form action={action}>
      <div className='space-y-5'>
        <div className='space-y-1.5'>
          <Label htmlFor='name'>Name:</Label>
          <Input
            id='name'
            name='name'
            type='name'
            autoComplete='name'
            placeholder='Your full name'
            defaultValue=''
            required
            className='p-2.5 text-sm transition-colors'
          />
        </div>
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
              className='select-none size-5 absolute top-[50%] right-2 text-muted-foreground p-1'>
              <EyeIcon />
            </Button>
          ) : (
            <Button
              size='icon'
              type='button'
              variant='ghost'
              title='Hide password'
              onClick={() => setPasswordType('password')}
              className='select-none size-5 absolute top-[50%] right-2 text-muted-foreground p-1'>
              <EyeClosedIcon />
            </Button>
          )}
        </div>
        <div className='space-y-1.5 relative'>
          <Label htmlFor='confirmPassword'>Confirm Password:</Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type={confirmPasswordType}
            placeholder='Confirm your password'
            defaultValue=''
            required
            className='p-2.5 text-sm transition-colors'
          />
          {confirmPasswordType === 'password' ? (
            <Button
              size='icon'
              type='button'
              variant='ghost'
              title='Show password'
              onClick={() => setConfirmPasswordType('text')}
              className='select-none size-5 p-1 absolute top-[50%] right-2 text-muted-foreground'>
              <EyeIcon />
            </Button>
          ) : (
            <Button
              size='icon'
              type='button'
              variant='ghost'
              title='Hide password'
              onClick={() => setConfirmPasswordType('password')}
              className='select-none size-5 p-1 absolute top-[50%] right-2 text-muted-foreground'>
              <EyeClosedIcon />
            </Button>
          )}
        </div>
        <SignUpButton />
        {data && !data.success && (
          <p className='text-center text-xs text-rose-500'>{data.message}</p>
        )}
        <div className='text-center text-xs text-muted-foreground'>
          Already have a {APP_NAME} account?
          <Link href='/sign-in' target='_self' className='ms-1 underline'>
            Login here
          </Link>
        </div>
      </div>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
    </form>
  );
};

export default SignUpForm;
