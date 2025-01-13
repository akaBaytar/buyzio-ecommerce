'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import prisma from '@/database';
import { hash } from '@/lib/encrypt';
import { handleError } from '@/lib/utils';
import { utapi } from '@/server/uploadthing';
import { auth, signIn, signOut } from '@/auth';

import {
  SignInFormSchema,
  SignUpFormSchema,
  PaymentMethodSchema,
  ShippingAddressSchema,
  UpdateUserSchema,
} from '@/schemas';

import type { ShippingAddress, PaymentMethod, UpdateUser } from '@/types';

export const signInUser = async (_: unknown, formData: FormData) => {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully.' };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { success: false, message: 'Invalid email or password.' };
  }
};

export const signOutUser = async () => {
  (await cookies()).delete('sessionCartId');

  await signOut({ redirectTo: '/' });
};

export const signUpUser = async (_: unknown, formData: FormData) => {
  try {
    const user = SignUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const hashedPassword = await hash(user.password);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    await signIn('credentials', { email: user.email, password: user.password });

    return { success: true, message: 'Registered successfully.' };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return JSON.parse(JSON.stringify(user));
};

export const updateUser = async (user: UpdateUser) => {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    const currentUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!currentUser) throw new Error('User not found.');

    const updatedUser = UpdateUserSchema.parse(user);

    if (
      updatedUser.newPassword &&
      updatedUser.newPassword === updatedUser.confirmPassword
    ) {
      const hashedPassword = await hash(updatedUser.newPassword);

      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          password: hashedPassword,
        },
      });
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'User information updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!user) throw new Error('User not found.');

    const address = ShippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: user.id },
      data: { address },
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'Address saved successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const updateUserPaymentMethod = async (data: PaymentMethod) => {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!user) throw new Error('User not found.');

    const paymentMethod = PaymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: user.id },
      data: { paymentMethod: paymentMethod.type },
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'Payment method updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};

export const updateUserAvatar = async (imageUrl: string) => {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) throw new Error('User not found.');

    const currentImgId = currentUser?.image?.split('/').pop();

    if (currentImgId) await utapi.deleteFiles(currentImgId);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { image: imageUrl },
    });

    revalidatePath('/profile');

    return {
      success: true,
      message: 'User Avatar updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: handleError(error),
    };
  }
};
