'use client';

import { useRef, useState, ChangeEvent } from 'react';
import { X, UploadSimple, CircleNotch } from '@phosphor-icons/react';
import { processImage } from '@/lib/image';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsProcessing(true);
    setError(null);
    try {
      const dataUrl = await processImage(file);
      onImageChange(dataUrl);
    } catch {
      setError('Could not process image. Please try a different file.');
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    setError(null);
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
            className="w-full max-h-48 object-contain border border-[var(--color-border)] bg-[var(--color-surface)]"
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
          disabled={isProcessing}
          className="w-full py-6 border border-dashed border-[var(--color-border)] flex items-center justify-center gap-2 text-[var(--color-muted)] hover:border-[var(--color-title)] hover:text-[var(--color-title)] transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing…</span>
            </>
          ) : (
            <>
              <UploadSimple weight="bold" className="w-4 h-4" />
              <span className="text-sm">Upload image</span>
            </>
          )}
        </button>
      )}
      {error && (
        <p className="text-xs text-[var(--color-error)] mt-1.5">{error}</p>
      )}
    </div>
  );
}
