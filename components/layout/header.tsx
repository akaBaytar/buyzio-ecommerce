import Link from 'next/link';
import Image from 'next/image';

import {
  UserIcon,
  HeartIcon,
  SearchIcon,
  ShoppingCartIcon,
} from 'lucide-react';

import { Button } from '../ui/button';

import { APP_NAME } from '@/constants';

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' title='Buyzio - Homepage' className='flex-start'>
            <Image
              src='logo.svg'
              alt={`${APP_NAME} Homepage`}
              width={48}
              height={48}
              priority={true}
            />
            <span className='hidden font-bold text-2xl tracking-wider ms-2 md:block'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='space-x-2'>
          <Button asChild variant='outline' size='icon' title='Sign in'>
            <Link href='/sign-in'>
              <UserIcon />
            </Link>
          </Button>
          <Button
            asChild
            variant='outline'
            size='icon'
            title='Search for products'>
            <Link href='/search'>
              <SearchIcon />
            </Link>
          </Button>
          <Button asChild variant='outline' size='icon' title='Favorites'>
            <Link href='/favorites'>
              <HeartIcon />
            </Link>
          </Button>
          <Button asChild variant='outline' size='icon' title='Shopping cart'>
            <Link href='/cart'>
              <ShoppingCartIcon />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
