'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { Loader2Icon } from 'lucide-react';

import { Button } from '../ui/button';

const TARGET_DATE = new Date('2025-03-01T00:00:00');

const calculateTimeRemaining = (target: Date) => {
  const current = new Date();
  const difference = Math.max(Number(target) - Number(current), 0);

  return {
    days: Math.floor(difference / (24 * 60 * 60 * 1000)),
    hours: Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
    minutes: Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((difference % (60 * 1000)) / 1000),
  };
};

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    setTime(calculateTimeRemaining(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);

      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (
    time?.days === 0 &&
    time?.hours === 0 &&
    time?.minutes === 0 &&
    time?.seconds === 0
  ) {
    return <></>;
  }

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 gap-10 mt-20'>
      <div className='flex flex-col justify-center gap-2.5'>
        <h3 className='h2-bold text-center sm:text-start'>Deal of the Month</h3>
        <p className='text-center sm:text-start text-pretty text-sm font-light'>
          Get ready for a shopping experience like never before with our Deals
          of the Month. Every purchase comes with exclusive perks and offers,
          making this month a celebration of savvy choices and amazing deals.
        </p>
        {time ? (
          <ul className='grid grid-cols-4'>
            <StatBox label='Days' value={time.days} />
            <StatBox label='Hours' value={time.hours} />
            <StatBox label='Minutes' value={time.minutes} />
            <StatBox label='Seconds' value={time.seconds} />
          </ul>
        ) : (
          <Loader2Icon className='size-4 animate-spin' />
        )}
        <div className='text-center sm:text-start'>
          <Button asChild>
            <Link href='/products'>View Products</Link>
          </Button>
        </div>
      </div>
      <div className='flex justify-center'>
        <Image
          src='/home/deal-countdown.png'
          alt='a woman hold shopping bags'
          width={770}
          height={350}
          className='size-full object-cover rounded-md'
        />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => {
  return (
    <li className='w-full text-center sm:text-start py-5'>
      <p className='text-4xl font-bold'>{value}</p>
      <p>{label}</p>
    </li>
  );
};

export default DealCountdown;
