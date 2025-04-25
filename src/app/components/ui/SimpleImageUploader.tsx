'use client';

import { useState, useRef } from 'react';
import styles from './DirectImageUploader.module.scss';

interface SimpleImageUploaderProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onError?: (error: string) => void;
  label?: string;
  className?: string;
}

export default function SimpleImageUploader({
  initialImage = '',
  onImageUpload,
  onError,
  label = 'Tải ảnh lên',
  className = '',
}: SimpleImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Vui lòng chọn file hình ảnh';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = 'Kích thước file không được vượt quá 10MB';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Tạo URL tạm thời để xem trước ảnh ngay lập tức
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Giả lập quá trình tải lên
      console.log('Đang giả lập quá trình tải ảnh lên...');
      
      // Tạo độ trễ giả lập để mô phỏng quá trình tải lên
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sử dụng URL xem trước thay vì URL từ Cloudflare Images
      onImageUpload(previewUrl);
      
      console.log('Tải lên thành công (giả lập)!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh lên';
      setError(errorMessage);

      // Gọi callback onError nếu được cung cấp
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Giả lập việc thay đổi input file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;

      // Kích hoạt sự kiện change
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className={`${styles.imageUploader} ${className}`}>
      <label className={styles.label}>{label}</label>

      <div
        className={styles.dropZone}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {imagePreview ? (
          <div className={styles.previewContainer}>
            <img
              src={imagePreview}
              alt="Preview"
              className={styles.preview}
            />
            <div className={styles.overlay}>
              <span>Thay đổi ảnh</span>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Kéo thả ảnh vào đây hoặc nhấp để chọn</span>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className={styles.fileInput}
        />
      </div>

      {isUploading && <div className={styles.uploading}>Đang tải ảnh lên...</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
