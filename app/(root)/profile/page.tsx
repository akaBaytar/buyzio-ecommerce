import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

import type { Metadata } from 'next';
import ProfileForm from '@/components/shared/profile-form';

export const metadata: Metadata = {
  title: 'Profile',
};

const ProfilePage = async () => {
  const session = await auth();

  console.log({session});
  

  return (
    <SessionProvider session={session}>
      <div className='space-y-5'>
        <h1 className='h2-bold'>My Profile</h1>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
