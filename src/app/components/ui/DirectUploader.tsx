'use client';

import { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { uploadImage } from '@/app/api/cloudflare';
import styles from './DirectUploader.module.scss';

interface DirectUploaderProps {
  onUploadComplete: (imageUrl: string) => void;
  className?: string;
  maxSize?: number; // in MB
  label?: string;
}

export default function DirectUploader({ 
  onUploadComplete, 
  className,
  maxSize = 10, // Default max size 10MB
  label = 'Upload Image'
}: DirectUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must not exceed ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload to Cloudflare Images
      const result = await uploadImage(file);
      
      if (!result.success) {
        throw new Error('Upload failed');
      }

      // Create object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Call callback with Cloudflare Images URL
      onUploadComplete(result.imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${styles.uploader} ${className || ''}`}>
      {label && <span className={styles.label}>{label}</span>}
      
      <div className={styles.uploadArea}>
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <label className={styles.changeButton}>
              <input
                type="file"
                onChange={handleUpload}
                accept="image/*"
                disabled={uploading}
              />
              {uploading ? 'Uploading...' : 'Change Image'}
            </label>
          </div>
        ) : (
          <label className={styles.uploadButton}>
            <input
              type="file"
              onChange={handleUpload}
              accept="image/*"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <FaSpinner className={styles.spinner} />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>{label}</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}