'use client';

import { useCallback, useRef } from 'react';
import { TripPhoto } from '@/types/diary';
import { generateId } from '@/lib/utils';
import { Camera, X } from 'lucide-react';

interface PhotoUploadProps {
  photos: TripPhoto[];
  onChange: (photos: TripPhoto[]) => void;
  maxPhotos?: number;
}

function compressImage(file: File, maxWidth: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PhotoUpload({ photos, onChange, maxPhotos = 5 }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remaining = maxPhotos - photos.length;
      const filesToProcess = Array.from(files).slice(0, remaining);

      const newPhotos: TripPhoto[] = [];
      for (const file of filesToProcess) {
        try {
          const dataUrl = await compressImage(file);
          newPhotos.push({
            id: generateId(),
            dataUrl,
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error('Failed to process image:', err);
        }
      }

      onChange([...photos, ...newPhotos]);
    },
    [photos, onChange, maxPhotos]
  );

  const removePhoto = (photoId: string) => {
    onChange(photos.filter((p) => p.id !== photoId));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Kuvat ({photos.length}/{maxPhotos})
      </label>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.dataUrl}
              alt="Retkikuva"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-green-500 hover:text-green-500 transition-colors"
          >
            <Camera size={24} />
            <span className="text-xs">Lisää</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
