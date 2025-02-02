import Link from 'next/link';
import Image from 'next/image';

import { ShoppingCartIcon } from 'lucide-react';

import { Button } from '../ui/button';

import Search from '../admin/search';
import ModeToggle from '../shared/mode-toggle';
import UserButton from '../shared/user-button';
import ProductSearch from '../shared/product-search';

import { APP_NAME } from '@/constants';
import { getUserCart } from '@/actions/cart.action';

type PropType = { adminLayout?: boolean };

const Header = async ({ adminLayout = false }: PropType) => {
  const cart = await getUserCart();

  const itemsCount = cart?.items.length;

  return (
    <header className='w-full border-b border-input'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' title='Buyzio - Homepage' className='flex-start'>
            <Image
              src='/assets/logo.svg'
              width={48}
              height={48}
              priority={true}
              alt={`${APP_NAME} Homepage`}
              style={{ height: 'auto', width: 'auto' }}
            />
            <span className='text-lg tracking-widest text-[#658ca3] ms-1.5'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <ModeToggle />
          {adminLayout ? <Search /> : <ProductSearch />}
          <Button
            asChild
            variant='outline'
            size='icon'
            title='Shopping cart'
            className='relative'>
            <Link href='/cart'>
              <ShoppingCartIcon />
              {itemsCount && itemsCount > 0 ? (
                <span className='absolute -top-1.5 -end-1.5 text-[.65rem] bg-muted size-3 rounded-full flex-center p-2 border border-input'>
                  {itemsCount}
                </span>
              ) : null}
            </Link>
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
