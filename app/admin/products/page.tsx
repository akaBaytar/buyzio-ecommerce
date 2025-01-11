import Link from 'next/link';

import { EditIcon, EyeIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Pagination from '@/components/shared/pagination';
import RemoveDialog from '@/components/shared/remove-dialog';

import { removeProduct } from '@/actions/admin.action';
import { formatCurrency, formatID } from '@/lib/utils';
import { getAllProducts } from '@/actions/product.action';

import type { Metadata } from 'next';
import type { Product } from '@prisma/client';

type PageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
};

export const metadata: Metadata = {
  title: 'All Products',
};

const AllProductsPage = async ({ searchParams }: PageProps) => {
  const sp = await searchParams;

  const page = +sp.page || 1;
  const query = sp.query || '';
  const category = sp.category || '';

  const { products, totalPages, productCount } = await getAllProducts({
    query,
    page,
    category,
  });

  return (
    <div className='space-y-5'>
      <div className='flex-between'>
        <h1 className='h2-bold'>All Products</h1>
        <div className='flex gap-2'>
          <Button asChild variant='outline' size='icon' title='Add New Product'>
            <Link href='/admin/products/add'>
              <PlusIcon className='size-4' />
            </Link>
          </Button>
          {totalPages && totalPages > 1 && (
            <Pagination
              text={false}
              page={+page || 1}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className='border-input hover:bg-inherit'>
            <TableHead className='min-w-[16ch]'>Product ID</TableHead>
            <TableHead className='min-w-[16ch]'>Name</TableHead>
            <TableHead className='min-w-[16ch]'>Price</TableHead>
            <TableHead className='min-w-[16ch]'>Category</TableHead>
            <TableHead className='min-w-[16ch]'>Stock</TableHead>
            <TableHead className='min-w-[16ch]'>Rating</TableHead>
            <TableHead className='min-w-[16ch]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product: Product) => (
            <TableRow key={product.id} className='text-xs border-input'>
              <TableCell title={product.id}>{formatID(product.id)}</TableCell>
              <TableCell className='truncate'>{product.name}</TableCell>
              <TableCell>{formatCurrency(+product.price)}</TableCell>
              <TableCell className='truncate'>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{+product.rating}</TableCell>
              <TableCell className='space-x-1'>
                <Button
                  asChild
                  size='icon'
                  variant='outline'
                  title='Show Details'>
                  <Link href={`/product/${product.slug}`}>
                    <EyeIcon />
                  </Link>
                </Button>
                <Button
                  asChild
                  size='icon'
                  variant='outline'
                  title='Edit Product Details'>
                  <Link href={`/admin/products/${product.slug}`}>
                    <EditIcon />
                  </Link>
                </Button>
                <RemoveDialog id={product.id} action={removeProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className='text-xs'>
          Page: {page || '1'} of {totalPages} - Total Order: {productCount}
        </TableCaption>
      </Table>
    </div>
  );
};

export default AllProductsPage;
