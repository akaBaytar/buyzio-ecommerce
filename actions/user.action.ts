'use server';

import { cookies } from 'next/headers';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import prisma from '@/database';
import { hash } from '@/lib/encrypt';
import { handleError } from '@/lib/utils';
import { auth, signIn, signOut } from '@/auth';

import {
  SignInFormSchema,
  SignUpFormSchema,
  PaymentMethodSchema,
  ShippingAddressSchema,
} from '@/schemas';

import type { ShippingAddress, PaymentMethod } from '@/types';

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

  if (!user) throw new Error('User not found.');

  return user;
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
