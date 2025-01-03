import Link from 'next/link';
import Image from 'next/image';

import { UserIcon } from 'lucide-react';

import { Button } from '../ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { auth } from '@/auth';
import { signOutUser } from '@/actions/user.action';

const UserButton = async () => {
  const session = await auth();

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
              {userImg ? (
                <Image
                  src={userImg}
                  alt='User Avatar'
                  width={18}
                  height={18}
                  className='rounded-md'
                />
              ) : (
                <UserIcon className='size-4' />
              )}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='start'
          className='border-input py-2.5 px-5 mt-2 w-[168px]'>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-2.5'>
              <p className='text-sm leading-none line-clamp-1'>{fullName}</p>
              <p className='text-xs text-muted-foreground leading-none line-clamp-1'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className='p-0 mb-1'>
            <form action={signOutUser} className='w-full mt-2.5'>
              <Button variant='outline' size='sm' className='w-full'>
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
