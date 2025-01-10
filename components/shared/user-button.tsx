import Link from 'next/link';
import Image from 'next/image';

import {
  BoxIcon,
  UserIcon,
  MenuIcon,
  HeartIcon,
  ShirtIcon,
  TruckIcon,
  UsersIcon,
  LogOutIcon,
  ChartBarIcon,
} from 'lucide-react';

import { Button } from '../ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

import { auth } from '@/auth';
import { signOutUser } from '@/actions/user.action';

import type { User } from '@prisma/client';

const UserButton = async () => {
  const session = await auth();

  const isAdmin = (session?.user as User)?.role === 'admin';

  const email = session?.user?.email;
  const fullName = session?.user?.name;
  const userImg = session?.user?.image;

  if (!session) {
    return (
      <Button asChild variant='outline' size='icon' title='Sign in'>
        <Link href='/sign-in'>
          <UserIcon />
        </Link>
      </Button>
    );
  }

  return (
    <div title='User menu' className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button
              variant='outline'
              size='icon'
              className='relative flex-center'>
              <MenuIcon />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='border-input p-2.5 mt-1.5'>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex items-center gap-2.5'>
              {userImg ? (
                <Image
                  src={userImg}
                  alt='User Avatar'
                  width={26}
                  height={26}
                  className='rounded object-cover object-center aspect-square'
                />
              ) : (
                <Image
                  src='/user.png'
                  alt='User Avatar'
                  width={26}
                  height={26}
                  className='rounded object-cover object-center aspect-square'
                />
              )}
              <div className='flex flex-col gap-0.5'>
                <p className='text-xs leading-none line-clamp-1'>{fullName}</p>
                <p className='text-xs text-muted-foreground leading-none line-clamp-1'>
                  {email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href='/profile'
              className='w-full flex items-center gap-2.5 text-xs'>
              <UserIcon className='size-4' /> My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href='/orders'
              className='w-full flex items-center gap-2.5 text-xs'>
              <BoxIcon className='size-4' /> My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href='/favorites'
              className='w-full flex items-center gap-2.5 text-xs'>
              <HeartIcon className='size-4' /> Favorites List
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href='/admin/overview'
                  className='w-full flex items-center gap-2.5 text-xs'>
                  <ChartBarIcon className='size-4' /> Overview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/admin/products'
                  className='w-full flex items-center gap-2.5 text-xs'>
                  <ShirtIcon className='size-4' /> Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/admin/orders'
                  className='w-full flex items-center gap-2.5 text-xs'>
                  <TruckIcon className='size-4' /> All Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href='/admin/users'
                  className='w-full flex items-center gap-2.5 text-xs'>
                  <UsersIcon className='size-4' /> Customers
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={signOutUser} className='w-full'>
              <button
                type='submit'
                className='w-full flex items-center gap-2.5 text-xs'>
                <LogOutIcon className='size-4' /> Logout
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
