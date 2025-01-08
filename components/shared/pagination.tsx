'use client';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '../ui/button';

import { handleURLQuery } from '@/lib/utils';

type PropTypes = {
  page: number;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (type: string) => {
    const value = type === 'next' ? page + 1 : page - 1;

    const url = handleURLQuery({
      value: value.toString(),
      key: urlParamName || 'page',
      params: searchParams.toString(),
    });

    router.push(url);
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        size='sm'
        variant='outline'
        disabled={page <= 1}
        onClick={() => onClick('prev')}>
        <ChevronLeftIcon className='size-4' />
        Previous
      </Button>
      <Button
        size='sm'
        variant='outline'
        disabled={page >= totalPages}
        onClick={() => onClick('next')}>
        Next
        <ChevronRightIcon className='size-4' />
      </Button>
    </div>
  );
};

export default Pagination;
