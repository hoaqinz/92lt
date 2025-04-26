'use client';

import { useState } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { uploadToCloudflare } from '@/app/api/cloudflare';
import styles from './ImageUploader.module.scss';

interface ImageUploaderProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  label?: string;
}

export default function ImageUploader({ initialImage, onImageUpload, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chỉ tải lên file ảnh');
      return;
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Tải ảnh lên Cloudflare
      const imageUrl = await uploadToCloudflare(file);
      
      // Cập nhật preview
      setPreview(imageUrl);
      
      // Gọi callback
      onImageUpload(imageUrl);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.imageUploader}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.uploadArea}>
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <label className={styles.changeButton}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isUploading}
              />
              {isUploading ? 'Đang tải...' : 'Thay đổi ảnh'}
            </label>
          </div>
        ) : (
          <label className={styles.uploadButton}>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
            />
            {isUploading ? (
              <>
                <FaSpinner className={styles.spinner} />
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Tải ảnh lên</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
