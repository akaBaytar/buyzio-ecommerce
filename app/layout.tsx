import { Poppins } from 'next/font/google';

import { APP_NAME } from '@/constants';

import type { Metadata } from 'next';

import '@/styles/globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: `%s – Buyzio`,
    default: `${APP_NAME} – Your Ultimate Shopping Destination`,
  },
  description:
    'Discover a world of premium products and seamless shopping at Buyzio. From trending items to everyday essentials.',
  keywords:
    'buyzio, online shopping, e-commerce, premium products, trending items, shop online, best deals',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
};

export default Layout;
