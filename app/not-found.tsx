'use client';

import Link from 'next/link';
import Image from 'next/image';

import { APP_NAME } from '@/constants';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className='flex-center flex-col min-h-screen'>
      <div className='flex-center flex-col gap-5 text-center rounded-md'>
        <Image
          src='/assets/logo.svg'
          width={100}
          height={100}
          priority={true}
          alt={`${APP_NAME} Homepage`}
        />
        <h2 className='text-6xl font-bold'>404</h2>
        <h1 className='text-3xl font-bold'>Not Found</h1>
        <p className='font-medium'>Could not find requested page.</p>
        <Button asChild size='lg'>
          <Link href='/'>Go Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
