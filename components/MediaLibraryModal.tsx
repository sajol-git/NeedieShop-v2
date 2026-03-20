'use client';

import { useState, useEffect, useMemo, useId } from 'react';
import Image from 'next/image';
import { X, UploadCloud, Check, Loader2, RefreshCw } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  fileName?: string;
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  created_at: string;
}

export function MediaLibraryModal({ isOpen, onClose, onSelect, fileName }: MediaLibraryModalProps) {
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const id = useId().replace(/:/g, '');
  const publicId = useMemo(() => fileName ? `${fileName}_${id}` : undefined, [fileName, id]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cloudinary/images');
      if (!res.ok) {
        throw new Error('Failed to fetch images. Check your Cloudinary API credentials.');
      }
      const data = await res.json();
      setImages(data.resources || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setSelectedImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Media Library</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchImages}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <CldUploadWidget
            uploadPreset="needieshop"
            onSuccess={(result: any) => {
              if (result.info && result.info.secure_url) {
                const newImage = {
                  public_id: result.info.public_id,
                  secure_url: result.info.secure_url,
                  created_at: result.info.created_at
                };
                setImages(prev => [newImage, ...prev]);
                setSelectedImage(result.info.secure_url);
              }
            }}
            options={{
              maxFiles: 10,
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
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <UploadCloud className="w-4 h-4" />
                Upload New
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading media library...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500">
              <p className="text-center max-w-md">{error}</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No images found in the needieshop folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {images.map((img) => (
                <div 
                  key={img.public_id}
                  onClick={() => setSelectedImage(img.secure_url)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === img.secure_url 
                      ? 'border-indigo-600 shadow-md scale-[0.98]' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img.secure_url}
                    alt={img.public_id}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  {selectedImage === img.secure_url && (
                    <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                      <div className="bg-indigo-600 text-white p-1.5 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedImage) {
                onSelect(selectedImage);
                onClose();
              }
            }}
            disabled={!selectedImage}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
