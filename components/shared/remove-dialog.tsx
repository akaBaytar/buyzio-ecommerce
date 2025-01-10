'use client';

import { useState, useTransition } from 'react';

import { Loader2Icon, TrashIcon } from 'lucide-react';

import { Button } from '../ui/button';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '../ui/alert-dialog';

import { useToast } from '@/hooks/use-toast';

type PropTypes = {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
};

const RemoveDialog = ({ id, action }: PropTypes) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const onClick = () => {
    startTransition(async () => {
      const response = await action(id);

      setOpen(false);

      toast({
        description: response.message,
      });
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild title='Remove Order'>
        <Button size='icon' variant='outline'>
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='border-input'>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove it?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Removal process cannot be undone. Please make sure you want to
            remove it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='min-w-24'>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={onClick} className='min-w-24'>
            {isPending ? (
              <Loader2Icon className='size-4 animate-spin' />
            ) : (
              'Remove'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveDialog;
