'use client';

import { useState } from 'react';

import { SearchIcon } from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '../ui/dialog';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '../ui/select';

import { SEARCH_PATHS } from '@/constants';

const Search = () => {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(SEARCH_PATHS[0]);

  const actionURL = `/admin/${query}`;

  return (
    <Dialog>
      <DialogTrigger
        asChild
        title='Search'
        className='flex items-center text-sm gap-1 p-2.5 rounded-md border border-input'>
        <Button variant='outline'>
          <SearchIcon className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='border-input'>
        <DialogHeader>
          <DialogTitle className='text-start'>Search</DialogTitle>
          <DialogDescription className='text-start text-pretty'>
            As an administrator, you can search for products, users and orders.
          </DialogDescription>
        </DialogHeader>
        <form action={actionURL}>
          <div className='space-y-5'>
            <Select value={query} onValueChange={setQuery}>
              <SelectTrigger>
                <SelectValue placeholder='Select search area' />
              </SelectTrigger>
              <SelectContent className='border-input'>
                {SEARCH_PATHS.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className='cursor-pointer'>
                    {role.charAt(0).toUpperCase()}
                    {role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name='query'
              type='search'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='text-sm'
            />
          </div>
          <button type='submit' className='sr-only'>
            search
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
