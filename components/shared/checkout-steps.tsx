import { Fragment } from 'react';

import { cn } from '@/lib/utils';
import { CHECKOUT_STEPS } from '@/constants';

import type { CheckoutSteps } from '@/types';

const CheckoutSteps = ({ currentStep }: { currentStep: CheckoutSteps }) => {
  return (
    <div className='flex-between text-center text-xs font-medium'>
      {CHECKOUT_STEPS.map(({ title, icon: Icon }) => (
        <Fragment key={title}>
          <div
            title={title}
            className={cn(
              'p-2.5 md:min-w-[20ch] rounded-md border border-input',
              title === currentStep && 'bg-muted'
            )}>
            <span className='hidden md:block'>{title}</span>
            <span className='md:hidden'>
              <Icon className='size-4' />
            </span>
          </div>
          {title !== 'Place Order' && (
            <hr className='w-full border-t border-input' />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
