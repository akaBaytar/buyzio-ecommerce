import { createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { auth } from '@/auth';

import type { FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter: FileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 3,
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session) throw new UploadThingError('Unauthorized.');

      return { userId: session.user?.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
};

export type OurFileRouter = typeof ourFileRouter;
