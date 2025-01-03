import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from './database';
import { compare } from './lib/encrypt';

import type { NextAuthConfig } from 'next-auth';

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },

      async authorize(credentials) {
        if (credentials === null) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, trigger, token }) {
      session.user.id = token.sub as string;

      if (trigger === 'update') session.user.name = user.name;

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
