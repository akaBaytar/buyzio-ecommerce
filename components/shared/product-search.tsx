import { SearchIcon } from 'lucide-react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { getAllCategories } from '@/actions/product.action';

const ProductSearch = async () => {
  const data = await getAllCategories();

  return (
    <Dialog>
      <DialogTrigger
        asChild
        title='Search products'
        className='flex items-center text-sm gap-1 p-2.5 rounded-md border border-input'>
        <Button variant='outline' size='icon'>
          <SearchIcon className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='border-input'>
        <DialogHeader>
          <DialogTitle className='text-start'>Search Products</DialogTitle>
          <DialogDescription className='text-start text-pretty'>
            Search for products and narrow your search by selecting a category.
          </DialogDescription>
        </DialogHeader>
        <form action='/products'>
          <div className='space-y-2.5'>
            <Select name='category' defaultValue='all'>
              <SelectTrigger>
                <SelectValue placeholder='All Categories' />
              </SelectTrigger>
              <SelectContent className='border-input'>
                <SelectItem key='All Categories' value='all'>
                  All Categories
                </SelectItem>
                {data.map((d) => (
                  <SelectItem
                    key={d.category}
                    value={d.category.toLowerCase()}
                    className='cursor-pointer'>
                    {d.category.charAt(0).toUpperCase()}
                    {d.category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name='query'
              type='search'
              placeholder='Search product'
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

export default ProductSearch;
