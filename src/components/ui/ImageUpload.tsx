'use client';

import { useRef, ChangeEvent } from 'react';
import { Image as ImageIcon, X, UploadSimple } from '@phosphor-icons/react';
import Button from './Button';

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
            className="w-full max-h-64 object-contain rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
          <Button
            variant="danger"
            size="icon"
            onClick={handleRemove}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <X weight="bold" className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-[var(--color-border)] rounded-lg
            flex flex-col items-center justify-center gap-2 text-[var(--color-muted)]
            hover:border-[var(--color-title)] hover:text-[var(--color-title)]
            transition-all duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
            <UploadSimple weight="bold" className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">Click to upload image</span>
          <span className="text-xs">PNG, JPG up to 10MB</span>
        </button>
      )}
    </div>
  );
}
