'use client';

import { useRef, ChangeEvent } from 'react';
import { X, UploadSimple } from '@phosphor-icons/react';

interface ImageUploadProps {
  imageData: string | null;
  onImageChange: (data: string | null) => void;
  className?: string;
}

export default function ImageUpload({
  imageData,
  onImageChange,
  className = '',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imageData ? (
        <div className="relative group">
          <img
            src={imageData}
            alt="Uploaded"
            className="w-full max-h-48 object-contain rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-muted)] hover:text-[var(--color-error)]"
            title="Remove"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-6 border border-dashed border-[var(--color-border)] rounded-lg
            flex items-center justify-center gap-2 text-[var(--color-muted)]
            hover:border-[var(--color-title)] hover:text-[var(--color-title)]
            transition-colors cursor-pointer"
        >
          <UploadSimple weight="bold" className="w-4 h-4" />
          <span className="text-sm">Upload image</span>
        </button>
      )}
    </div>
  );
}
