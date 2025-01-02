'use client';

import { useState, useEffect } from 'react';

import { useTheme } from 'next-themes';

import { SunIcon, MoonIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Skeleton className='shadow-sm size-9' />;

  return (
    <Button
      variant='outline'
      size='icon'
      title='Appearance'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ModeToggle;
