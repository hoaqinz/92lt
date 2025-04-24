'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageUploader.module.scss';

interface ImageUploaderProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  initialImage = '',
  onImageUpload,
  label = 'Tải ảnh lên',
  className = '',
}: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 10MB');
      return;
    }

    setError('');
    setIsUploading(true);

    // Tạo URL tạm thời để xem trước ảnh ngay lập tức
    let previewUrl = '';
    try {
      previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Tạo FormData để gửi file lên server
      const formData = new FormData();
      formData.append('file', file);

      console.log('Đang tải ảnh lên Cloudflare Images...');
      
      // Gửi request đến API route của Next.js
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      
      // Đọc response text trước để debug
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Nếu response không phải JSON hợp lệ
      if (!responseText || responseText.trim() === '') {
        throw new Error('Server trả về response rỗng');
      }
      
      // Parse JSON từ text
      const data = JSON.parse(responseText);
      
      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi tải ảnh lên');
      }
      
      console.log('Ảnh đã được tải lên Cloudflare Images:', data);
      
      // Xóa URL tạm thời
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Sử dụng URL từ Cloudflare Images
      if (data.url) {
        onImageUpload(data.url);
        
        // Cập nhật preview với URL thực tế
        setImagePreview(data.url);
      } else {
        throw new Error('Không nhận được URL ảnh từ server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh lên');
      
      // Sử dụng URL tạm thời nếu có lỗi
      if (previewUrl) {
        onImageUpload(previewUrl);
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
