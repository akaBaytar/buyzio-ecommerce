'use client';

import { Loader2Icon, ImagePlusIcon } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { UploadButton } from '@/lib/uploadthing';
import { updateUserAvatar } from '@/actions/user.action';

const AvatarUploader = () => {
  const { toast } = useToast();

  return (
    <div title='Change Avatar Image'>
      <UploadButton
        endpoint='imageUploader'
        content={{
          button({ ready }) {
            if (ready)
              return (
                <p className='flex items-center gap-2'>
                  <ImagePlusIcon className='size-4' />
                  <span className='hidden md:flex'>Set Avatar</span>
                </p>
              );
            return <Loader2Icon className='size-4 animate-spin' />;
          },
        }}
        appearance={{
          container: { padding: 0, margin: 0 },
          allowedContent: { display: 'none' },
        }}
        onClientUploadComplete={async (res: { url: string }[]) => {
          await updateUserAvatar(res[0].url);
        }}
        onUploadError={(err: Error) => {
          toast({ description: err.message });
        }}
        className='ut-button:border ut-button:border-input ut-button:bg-transparent ut-button:hover:bg-secondary ut-button:text-primary ut-button:text-sm ut-button:font-medium ut-button:h-9 ut-button:ut-uploading:bg-secondary ut-button:px-4 ut-button:max-w-fit'
      />
    </div>
  );
};

export default AvatarUploader;
