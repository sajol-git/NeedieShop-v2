'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
  className?: string;
  fileName?: string;
}

export function ImageUpload({ onUpload, buttonText = "Upload Image", className = "", fileName }: ImageUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm ${className}`}
      >
        <UploadCloud className="w-4 h-4" />
        {buttonText}
      </button>

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => {
          onUpload(url);
          setIsModalOpen(false);
        }}
        fileName={fileName}
      />
    </>
  );
}
