'use client';

import SimpleImageUploader from './SimpleImageUploader';

interface ImageUploaderProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onError?: (error: string) => void;
  label?: string;
  className?: string;
}

// Wrapper component để duy trì tương thích ngược
export default function ImageUploader({
  initialImage = '',
  onImageUpload,
  onError,
  label = 'Tải ảnh lên',
  className = '',
}: ImageUploaderProps) {
  // Sử dụng SimpleImageUploader thay vì DirectImageUploader
  return (
    <SimpleImageUploader
      initialImage={initialImage}
      onImageUpload={onImageUpload}
      onError={onError}
      label={label}
      className={className}
    />
  );
}
