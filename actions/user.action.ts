'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hash } from '@/lib/encrypt';

import prisma from '@/database';
import { signIn, signOut } from '@/auth';
import { SignInFormSchema, SignUpFormSchema } from '@/schemas';

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

export const signOutUser = async () => await signOut();

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
    if (isRedirectError(error)) throw error;

    return {
      success: false,
      message: 'An error occurred during registration.',
    };
  }
};
