'use client';

import { useState, useRef } from 'react';
import styles from './DirectImageUploader.module.scss';

interface DirectImageUploaderProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onError?: (error: string) => void;
  label?: string;
  className?: string;
}

export default function DirectImageUploader({
  initialImage = '',
  onImageUpload,
  onError,
  label = 'Tải ảnh lên',
  className = '',
}: DirectImageUploaderProps) {
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

      // Bước 1: Lấy URL tải lên trực tiếp từ Cloudflare API
      console.log('Đang lấy URL tải lên trực tiếp từ Cloudflare API...');
      
      // Thông tin xác thực Cloudflare (cập nhật)
      const accountId = '04725e5acc15b760fb22bf197ff9799f';
      const apiToken = 'JZYoQdkbYec97Na325HqQwEJAUn12Wh_tw6iUtPp';
      
      // Gọi trực tiếp đến Cloudflare API
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`
          },
          body: JSON.stringify({
            requireSignedURLs: false,
            metadata: {
              source: 'direct_client_upload'
            }
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Lỗi khi lấy URL tải lên: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Direct upload response:', data);
      
      if (!data.success || !data.result) {
        throw new Error('Cloudflare API trả về dữ liệu không hợp lệ');
      }
      
      const uploadUrl = data.result;
      console.log('Đã nhận URL tải lên trực tiếp:', uploadUrl);

      // Bước 2: Tải file lên URL trực tiếp
      console.log('Đang tải file lên...');
      const formData = new FormData();
      
      // Thêm các trường bắt buộc từ Cloudflare
      Object.entries(uploadUrl.form || {}).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
      // Thêm file
      formData.append('file', file);
      
      // Gửi file lên URL trực tiếp
      const uploadResponse = await fetch(uploadUrl.uploadURL, {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Tải lên thất bại: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
      
      console.log('Tải lên thành công!');
      
      // Lấy URL của ảnh đã tải lên
      const imageUrl = `https://imagedelivery.net/tJAHQehMkQM0pKlceH1PGg/${uploadUrl.id}/public`;
      console.log('URL ảnh:', imageUrl);
      
      // Sử dụng URL từ Cloudflare Images
      onImageUpload(imageUrl);

      // Cập nhật preview với URL thực tế
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh lên';
      setError(errorMessage);
      
      // Gọi callback onError nếu được cung cấp
      if (onError) {
        onError(errorMessage);
      }

      // Giữ lại URL xem trước tạm thời nếu có lỗi
      if (imagePreview) {
        onImageUpload(imagePreview);
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
