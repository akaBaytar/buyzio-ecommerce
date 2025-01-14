'use client';

import { useState } from 'react';

import { z } from 'zod';
import { Loader2Icon, StarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '../ui/dialog';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '../ui/select';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import { AddReviewSchema } from '@/schemas';

type PropTypes = {
  userId: string;
  productId: string;
  onSubmitted?: () => void;
};

const ReviewForm = ({ userId, productId, onSubmitted }: PropTypes) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof AddReviewSchema>>({
    resolver: zodResolver(AddReviewSchema),
    defaultValues: {
      title: '',
      description: '',
      rating: 5,
    },
  });

  const onClick = () => {
    setOpen(true);
  };

  const ratings = [
    { value: 5 },
    { value: 4 },
    { value: 3 },
    { value: 2 },
    { value: 1 },
  ];

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={onClick} variant='outline'>
        Leave a Review
      </Button>
      <DialogContent className='border-input'>
        <Form {...form}>
          <form method='POST'>
            <DialogHeader>
              <DialogTitle>Leave a Review</DialogTitle>
              <DialogDescription className='text-pretty'>
                You can leave a review, rate the product, or update your
                existing review.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-5 py-5'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='text'
                        placeholder='Enter title'
                        className='text-sm'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={5}
                        placeholder='Leave a review'
                        className='text-sm resize-none'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rating'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      defaultValue='5'
                      value={field.value.toString()}
                      onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='border-input'>
                        {ratings.map(({ value }) => (
                          <SelectItem
                            key={value}
                            value={value.toString()}
                            title={`${value}/5 rating`}
                            className='cursor-pointer'>
                            <span className='flex items-center gap-0.5'>
                              {Array.from({ length: value }).map((_, index) => (
                                <StarIcon
                                  key={index}
                                  className='fill-primary size-4'
                                />
                              ))}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type='submit' disabled={isSubmitting} className='w-full'>
                {isSubmitting ? (
                  <Loader2Icon className='size-4 animate-spin' />
                ) : (
                  'Leave a Review'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
