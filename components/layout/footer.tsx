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
import Link from 'next/link';
import Image from 'next/image';

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
    <div className='bg-black text-gray-50 py-20'>
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
            <div className='flex gap-1.5'>
              <Link href='https://www.apple.com/app-store/' target='_blank'>
                <Image
                  src='/assets/app-store.png'
                  alt='App Store'
                  width={102}
                  height={33}
                  className='border rounded-sm px-1.5 py-1 border-gray-500'
                />
              </Link>
              <Link href='https://play.google.com/store/' target='_blank'>
                <Image
                  src='/assets/google-play.png'
                  alt='Google Play'
                  width={117}
                  height={33}
                  className='border rounded-sm px-1.5 py-1 border-gray-500'
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
      <div className='flex-center p-5 text-xs'>
        Copyright {year} &copy; {APP_NAME}. All right reserved.
      </div>
    </footer>
  );
};

export default Footer;
