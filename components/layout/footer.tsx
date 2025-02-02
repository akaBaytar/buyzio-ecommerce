import Link from 'next/link';
import Image from 'next/image';

import {
  TruckIcon,
  HeadsetIcon,
  RotateCwIcon,
  CreditCardIcon,
} from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { APP_NAME } from '@/constants';

import type { ElementType } from 'react';

type PolicyProps = {
  icon: ElementType;
  title: string;
  text: string;
};

const PolicyItem = ({ icon: Icon, title, text }: PolicyProps) => {
  return (
    <div className='flex items-center gap-2.5'>
      <Icon className='size-12' />
      <div>
        <h4 className='uppercase font-semibold'>{title}</h4>
        <p className='text-xs font-light'>{text}</p>
      </div>
    </div>
  );
};

const Policy = () => {
  return (
    <div className='wrapper grid grid-cols-2 lg:grid-cols-4 gap-5'>
      <PolicyItem icon={TruckIcon} title='Free Delivery' text='From $99.99' />
      <PolicyItem
        icon={HeadsetIcon}
        title='Support 24/7'
        text='Online 24 hours'
      />
      <PolicyItem
        icon={RotateCwIcon}
        title='14 Days Return'
        text='Simply return it'
      />
      <PolicyItem
        icon={CreditCardIcon}
        title='Secure Payment'
        text='Paypal or Stripe'
      />
    </div>
  );
};

const Subscribe = () => {
  return (
    <div className='bg-foreground dark:bg-background text-gray-50 py-20'>
      <div className='wrapper flex flex-col justify-between md:flex-row gap-20'>
        <div className='md:w-1/2 space-y-10'>
          <div>
            <h4 className='text-2xl font-semibold leading-normal text-pretty'>
              Get our emails for info on new items, sales and more.
            </h4>
            <p className='text-[0.7rem] text-gray-400 mt-1.5'>
              We will email you a voucher worth $10 off your first order over
              $50.
            </p>
          </div>
          <div>
            <div className='flex'>
              <Input
                type='email'
                name='email'
                id='email'
                autoComplete='email'
                placeholder='Enter your email address'
                className='border-none bg-white text-black placeholder-gray-400 h-12 rounded-e-none'
              />
              <Button type='button' className='border h-12 rounded-s-none'>
                Subscribe
              </Button>
            </div>
            <p className='text-[0.7rem] text-gray-400 mt-1.5 text-pretty'>
              By subscribing you agree to our{' '}
              <Link href='/'>Terms & Conditions</Link> and{' '}
              <Link href='/'>Privacy & Cookies Policy</Link>.
            </p>
          </div>
        </div>
        <div className='md:w-1/2 space-y-10'>
          <div>
            <h4 className='text-2xl font-semibold leading-normal'>
              Need Help?
              <br />
              +(90) 555 55 55
            </h4>
            <p className='text-[0.7rem] text-gray-400 mt-1.5 text-pretty'>
              We are available 8:00am - 7:00pm
            </p>
          </div>
          <div>
            <div className='flex gap-5'>
              <Link href='https://www.apple.com/app-store/' target='_blank'>
                <Image
                  src='/assets/app-store.png'
                  alt='App Store'
                  width={102}
                  height={33}
                  className='border rounded-md px-2.5 h-12 object-contain border-gray-400'
                />
              </Link>
              <Link href='https://play.google.com/store/' target='_blank'>
                <Image
                  src='/assets/google-play.png'
                  alt='Google Play'
                  width={117}
                  height={33}
                  className='border rounded-md px-2.5 h-12 object-contain border-gray-400'
                />
              </Link>
            </div>
            <p className='text-[0.7rem] text-gray-400 mt-1.5 text-pretty'>
              Shopping App: Try our View in Your Room feature, manage registries
              and save payment info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-input'>
      <Policy />
      <Subscribe />
      <div className='wrapper flex items-center justify-between flex-col lg:flex-row gap-10 lg:gap-20 my-10'>
        <div className='flex-center flex-col gap-5 w-full lg:w-1/2 md:items-start lg:max-w-xs xl:max-w-md'>
          <div className='flex-start'>
            <Link href='/' title='Buyzio - Homepage' className='flex-start'>
              <Image
                src='/assets/logo.svg'
                width={48}
                height={48}
                priority={true}
                alt={`${APP_NAME} Homepage`}
                style={{ height: 'auto', width: 'auto' }}
              />
              <span className='text-lg tracking-widest text-[#658ca3] ms-1.5'>
                {APP_NAME}
              </span>
            </Link>
          </div>
          <p className='text-xs leading-normal text-pretty text-center md:text-start'>
            Discover a world of premium products and seamless shopping at
            Buyzio. From trending items to everyday essentials.
          </p>
          <p className='text-xs leading-normal text-pretty text-center md:text-start'>
            +(90) 555 55 55 — contact@buyzio.com
          </p>
        </div>
        <div className='flex flex-col gap-5 text-center items-center md:flex-row md:w-full md:text-start md:justify-between lg:w-1/2'>
          <div className='text-xs space-y-1.5'>
            <h5 className='text-sm font-bold'>Information</h5>
            <ul className='space-y-1'>
              <li className='hover:underline cursor-pointer'>About Us</li>
              <li className='hover:underline cursor-pointer'>Drop Shipping</li>
              <li className='hover:underline cursor-pointer'>Privacy Policy</li>
              <li className='hover:underline cursor-pointer'>Returns Policy</li>
              <li className='hover:underline cursor-pointer'>
                Shipping Policy
              </li>
            </ul>
          </div>
          <div className='text-xs space-y-1.5'>
            <h5 className='text-sm font-bold'>Account</h5>
            <ul className='space-y-1'>
              <li className='hover:underline cursor-pointer'>Dashboard</li>
              <li className='hover:underline cursor-pointer'>My Orders</li>
              <li className='hover:underline cursor-pointer'>My Wishlist</li>
              <li className='hover:underline cursor-pointer'>Account Detail</li>
              <li className='hover:underline cursor-pointer'>
                Track My Order(s)
              </li>
            </ul>
          </div>
          <div className='text-xs space-y-1.5'>
            <h5 className='text-sm font-bold'>Shop</h5>
            <ul className='space-y-1'>
              <li className='hover:underline cursor-pointer'>Discount</li>
              <li className='hover:underline cursor-pointer'>Affiliate</li>
              <li className='hover:underline cursor-pointer'>Bestsellers</li>
              <li className='hover:underline cursor-pointer'>Sale Products</li>
              <li className='hover:underline cursor-pointer'>
                Latest Products
              </li>
            </ul>
          </div>
          <div className='text-xs space-y-1.5'>
            <h5 className='text-sm font-bold'>Categories</h5>
            <ul className='space-y-1'>
              <li className='hover:underline cursor-pointer'>Men</li>
              <li className='hover:underline cursor-pointer'>Bags</li>
              <li className='hover:underline cursor-pointer'>Shoes</li>
              <li className='hover:underline cursor-pointer'>Women</li>
              <li className='hover:underline cursor-pointer'>Outerwear</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='border-t border-input text-xs'>
        <div className='wrapper flex flex-col-reverse md:flex-row gap-5 justify-between items-center'>
          <p>
            Copyright {year} &copy; {APP_NAME}. All right reserved.
          </p>
          <ul className='flex gap-1.5 items-center'>
            <li className='hover:underline cursor-pointer'>Privacy Policy</li>
            <li>|</li>
            <li className='hover:underline cursor-pointer'>
              Terms and Conditions
            </li>
            <li>|</li>
            <li className='hover:underline cursor-pointer'>Returns Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
