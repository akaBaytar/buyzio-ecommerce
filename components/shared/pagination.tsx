'use client';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '../ui/button';

import { handleURLQuery } from '@/lib/utils';

type PropTypes = {
  text?: boolean;
  page: number;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({
  page,
  totalPages,
  urlParamName,
  text = true,
}: PropTypes) => {
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
        size={text ? 'sm' : 'icon'}
        variant='outline'
        disabled={page <= 1}
        title='Show Previous Page'
        onClick={() => onClick('prev')}>
        <ChevronLeftIcon className='size-4' />
        {text && 'Previous'}
      </Button>
      <Button
        size={text ? 'sm' : 'icon'}
        variant='outline'
        disabled={page >= totalPages}
        title='Show Next Page'
        onClick={() => onClick('next')}>
        {text && 'Next'}
        <ChevronRightIcon className='size-4' />
      </Button>
    </div>
  );
};

export default Pagination;
