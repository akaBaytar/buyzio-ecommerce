import Link from 'next/link';

import { EditIcon } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

import Pagination from '@/components/shared/pagination';
import RemoveDialog from '@/components/shared/remove-dialog';

import { auth } from '@/auth';
import { getAllUsers, removeUser } from '@/actions/admin.action';
import { formatDate, formatID } from '@/lib/utils';

import type { Metadata } from 'next';
import type { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'All Customers',
};

type PageProps = {
  searchParams: Promise<{ page: string }>;
};

const AllUsersPage = async ({ searchParams }: PageProps) => {
  const { page } = await searchParams;

  const session = await auth();

  if ((session?.user as User).role !== 'admin') throw new Error('AUTH');

  const response = await getAllUsers({ page: +page || 1 });

  const { totalPages, userCount, users } = response;

  return (
    <>
      <div className='flex-between my-5'>
        <h1 className='h2-bold'>All Customers</h1>
        {totalPages && totalPages > 1 && (
          <Pagination page={+page || 1} totalPages={totalPages} />
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow className='border-input hover:bg-inherit'>
            <TableHead className='min-w-[16ch]'>Customer ID</TableHead>
            <TableHead className='min-w-[16ch]'>Name</TableHead>
            <TableHead className='min-w-[16ch]'>Email</TableHead>
            <TableHead className='min-w-[16ch]'>Role</TableHead>
            <TableHead className='min-w-[16ch]'>Account Creation</TableHead>
            <TableHead className='min-w-[16ch]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: User) => (
            <TableRow key={user.id} className='text-xs border-input'>
              <TableCell title={user.id}>{formatID(user.id)}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role.charAt(0).toUpperCase()}
                {user.role.slice(1)}
              </TableCell>
              <TableCell>{formatDate(user.createdAt).dateAndTime}</TableCell>
              <TableCell className='space-x-2'>
                <Button
                  asChild
                  size='icon'
                  variant='outline'
                  title='Edit Customer Details'>
                  <Link href={`/admin/users/${user.id}`}>
                    <EditIcon />
                  </Link>
                </Button>
                <RemoveDialog
                  id={user.id}
                  page='Customer'
                  action={removeUser}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className='text-xs'>
          Page: {page || '1'} of {totalPages} - Total Customer: {userCount}
        </TableCaption>
      </Table>
    </>
  );
};

export default AllUsersPage;
