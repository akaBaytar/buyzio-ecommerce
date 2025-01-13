import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import SignInForm from '@/components/layout/sign-in-form';

import { APP_NAME } from '@/constants';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
};

type PageProps = {
  searchParams: Promise<{ callbackUrl: string }>;
};

const SignInPage = async ({ searchParams }: PageProps) => {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  if (session) redirect(callbackUrl || '/');

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card className='border-input'>
        <CardHeader className='space-y-5'>
          <Link href='/' className='flex-center'>
            <Image
              src='/assets/logo.svg'
              width={100}
              height={100}
              priority={true}
              alt={`${APP_NAME} Homepage`}
            />
          </Link>
          <CardTitle className='text-center'>Welcome Back</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your {APP_NAME} account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-5'>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
