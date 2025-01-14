import Image from 'next/image';

import { auth } from '@/auth';
import { EditIcon } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import ProfileForm from '@/components/shared/profile-form';
import AvatarUploader from '@/components/shared/avatar-uploader';
import ProfileAddressForm from '@/components/shared/profile-address-form';
import ProfilePaymentMethod from '@/components/shared/profile-payment-method';

import { formatDate } from '@/lib/utils';
import { getUser } from '@/actions/user.action';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

const ProfilePage = async () => {
  const session = await auth();

  const user = await getUser(session?.user?.id as string);

  const {
    streetAddress = '',
    city = '',
    postalCode = '',
    country = '',
  } = user.address || {};

  return (
    <SessionProvider session={session}>
      <h1 className='h2-bold'>{user.name}&apos;s Profile</h1>
      <div className='mt-5 space-y-5'>
        <Card className='border-input'>
          <CardHeader>
            <div className='flex-between'>
              <CardTitle>Personal Information</CardTitle>
              <div className='flex items-center gap-2.5'>
                <AvatarUploader />
                <Dialog>
                  <DialogTrigger
                    asChild
                    title='Change Personal Details'
                    className='flex items-center text-sm gap-1 p-2.5 rounded-md border border-input'>
                    <Button variant='outline'>
                      <EditIcon className='size-4' />
                      <span className='hidden md:flex'>Personal Details</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='border-input'>
                    <DialogHeader>
                      <DialogTitle className='text-start'>
                        Personal Information
                      </DialogTitle>
                      <DialogDescription className='text-start'>
                        You can change your email and full name without a
                        password or if you wish, you can set a new password.
                      </DialogDescription>
                    </DialogHeader>
                    <ProfileForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardDescription>
              You can view your personal information and change it if you wish.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center gap-5'>
            <Image
              src={user.image || '/assets/user.png'}
              width={64}
              height={64}
              alt={user.name}
              title={`${user.name}'s Avatar`}
              className='size-16 rounded-md object-cover'
            />
            <div className='text-sm space-y-1'>
              <p>Full Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Account Creation: {formatDate(user.createdAt).dateAndTime}</p>
            </div>
          </CardContent>
        </Card>
        <Card className='border-input'>
          <CardHeader>
            <div className='flex-between'>
              <CardTitle>Address Information</CardTitle>
              <Dialog>
                <DialogTrigger
                  asChild
                  className='flex items-center text-sm gap-1 p-2.5 rounded-md border border-input'>
                  <Button
                    variant='outline'
                    title={
                      user.address
                        ? 'Change Default Shipping Address'
                        : 'Add Shipping Address'
                    }>
                    <EditIcon className='size-4' />
                    <span className='hidden md:flex'>
                      {user.address ? 'Update Shipping Address' : 'Add Shipping Address'}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className='border-input'>
                  <DialogHeader>
                    <DialogTitle className='text-start'>
                      {user.address
                        ? 'Update Address Information'
                        : 'Add Address Information'}
                    </DialogTitle>
                    <DialogDescription className='text-start'>
                      {user.address
                        ? 'You can update your address information here or during the product purchase process.'
                        : 'You can add a new shipping address to your profile.'}
                    </DialogDescription>
                  </DialogHeader>
                  <ProfileAddressForm address={user.address || {}} />
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              You can view {user.address ? 'and update' : 'or add'} your address
              information.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center gap-5'>
            {user.address ? (
              <div className='text-sm space-y-1'>
                <p>Street & Avenue: {streetAddress}</p>
                <p>City: {city}</p>
                <p>Postal code: {postalCode}</p>
                <p>Country: {country}</p>
              </div>
            ) : (
              <p className='text-sm'>No shipping address available.</p>
            )}
          </CardContent>
        </Card>
        <Card className='border-input'>
          <CardHeader>
            <div className='flex-between'>
              <CardTitle>Payment Information</CardTitle>
              <Dialog>
                <DialogTrigger
                  asChild
                  className='flex items-center text-sm gap-1 p-2.5 rounded-md border border-input'>
                  <Button
                    variant='outline'
                    title={
                      user.paymentMethod
                        ? 'Change Default Payment Method'
                        : 'Add Default Payment Method'
                    }>
                    <EditIcon className='size-4' />
                    <span className='hidden md:flex'>
                      {user.paymentMethod ? 'Payment Method' : 'Add Payment'}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className='border-input'>
                  <DialogHeader>
                    <DialogTitle className='text-start'>
                      {user.paymentMethod
                        ? 'Update Payment Method'
                        : 'Add Payment Method'}
                    </DialogTitle>
                    <DialogDescription className='text-start'>
                      {user.paymentMethod
                        ? 'You can view or change your default payment method.'
                        : 'You can add a default payment method to your profile.'}
                    </DialogDescription>
                  </DialogHeader>
                  <ProfilePaymentMethod
                    preferredPaymentMethod={user.paymentMethod || ''}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              You can view {user.paymentMethod ? 'or change' : 'or add'} your
              payment method.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center gap-5'>
            {user.paymentMethod ? (
              <div className='text-sm space-y-1'>
                <p>Payment Method: {user.paymentMethod}</p>
              </div>
            ) : (
              <p className='text-sm'>
                No default payment method available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
