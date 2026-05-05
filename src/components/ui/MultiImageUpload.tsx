'use client';

import { useRef, useState, ChangeEvent } from 'react';
import { X, UploadSimple, CircleNotch } from '@phosphor-icons/react';
import { processImage } from '@/lib/image';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  className?: string;
}

export default function MultiImageUpload({
  images,
  onChange,
  className = '',
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    try {
      const processed = await Promise.all(files.map(processImage));
      onChange([...images, ...processed]);
    } catch {
      setError('Could not process one or more images.');
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative group aspect-square">
            <img
              src={src}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-muted)] hover:text-[var(--color-error)] print:hidden"
              title="Remove"
            >
              <X weight="bold" className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isProcessing}
          className="aspect-square border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-1 text-[var(--color-muted)] hover:border-[var(--color-title)] hover:text-[var(--color-title)] transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-70 print:hidden"
        >
          {isProcessing ? (
            <>
              <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
              <span className="text-[11px]">Processing…</span>
            </>
          ) : (
            <>
              <UploadSimple weight="bold" className="w-4 h-4" />
              <span className="text-[11px]">
                {images.length === 0 ? 'Upload' : 'Add more'}
              </span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-[var(--color-error)] mt-1.5">{error}</p>
      )}
    </div>
  );
}
