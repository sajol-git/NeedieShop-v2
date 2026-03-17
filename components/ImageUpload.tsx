'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
  className?: string;
}

export function ImageUpload({ onUpload, buttonText = "Upload Image", className = "" }: ImageUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result: any) => {
        if (result.info && result.info.secure_url) {
          onUpload(result.info.secure_url);
        }
      }}
      options={{
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm ${className}`}
          >
            <UploadCloud className="w-4 h-4" />
            {buttonText}
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
