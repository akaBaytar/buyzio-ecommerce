import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from './database';
import { compare } from './lib/encrypt';

import type { NextAuthConfig } from 'next-auth';
import type { User } from './types';

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

      async authorize(credentials): Promise<User | null> {
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
            } as User;
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
          name: token.name,
        } as User,
      };
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
        token.name = user.name || user.email!.split('@')[0];

        if (user.name === 'NO_NAME') {
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const sessionCartId = (await cookies()).get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              await prisma.cart.deleteMany({ where: { userId: user.id } });

              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      return token;
    },

    authorized({ request, auth }) {
      const protectedRoutes = [
        /\/shipping/,
        /\/payment/,
        /\/order/,
        /\/orders/,
        /\/profile/,
        /\/admin/,
        /\/order\/(.*)/,
      ];

      const { pathname } = request.nextUrl;

      if (!auth && protectedRoutes.some((p) => p.test(pathname))) return false;

      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();

        const newRequestHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        response.cookies.set('sessionCartId', sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
