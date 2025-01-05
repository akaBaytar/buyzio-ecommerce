import { Fragment } from 'react';

import { cn } from '@/lib/utils';

type PropType =
  | 'Authentication'
  | 'Shipping Address'
  | 'Payment Method'
  | 'Place Order';

const CheckoutSteps = ({ currentStep }: { currentStep: PropType }) => {
  const steps = [
    'Authentication',
    'Shipping Address',
    'Payment Method',
    'Place Order',
  ];

  return (
    <div className='hidden md:flex justify-between items-center text-center text-xs font-medium'>
      {steps.map((step) => (
        <Fragment key={step}>
          <div
            className={cn(
              'p-2.5 min-w-[20ch] rounded-md border border-input',
              step === currentStep && 'bg-muted'
            )}>
            {step}
          </div>
          {step !== 'Place Order' && (
            <hr className='w-full border-t border-input' />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
