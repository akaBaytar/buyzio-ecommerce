import { notFound } from 'next/navigation';

import UpdateUserForm from '@/components/admin/user-form';

import { getUser } from '@/actions/user.action';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update User Details',
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const UserUpdatePage = async ({ params }: PageProps) => {
  const { id } = await params;

  const user = await getUser(id);

  if (!user) notFound();

  return (
    <div className='space-y-5'>
      <h1 className='h2-bold'>Update User Details</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default UserUpdatePage;
