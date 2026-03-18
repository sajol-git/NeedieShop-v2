'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud } from 'lucide-react';
import { useMemo, useId } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
  className?: string;
  fileName?: string;
}

export function ImageUpload({ onUpload, buttonText = "Upload Image", className = "", fileName }: ImageUploadProps) {
  const id = useId().replace(/:/g, '');
  const publicId = useMemo(() => fileName ? `${fileName}_${id}` : undefined, [fileName, id]);

  return (
    <CldUploadWidget
      uploadPreset="needieshop"
      onSuccess={(result: any) => {
        if (result.info && result.info.secure_url) {
          onUpload(result.info.secure_url);
        }
      }}
      options={{
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['webp', 'jpg', 'png', 'jpeg'],
        folder: 'needieshop',
        publicId,
        sources: ['local', 'url', 'camera'],
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#8B183A',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#8B183A',
            action: '#8B183A',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          }
        }
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
