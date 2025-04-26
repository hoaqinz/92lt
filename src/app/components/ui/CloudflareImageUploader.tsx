'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import styles from './CloudflareImageUploader.module.scss';

interface CloudflareImageUploaderProps {
  label: string;
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
}

const CloudflareImageUploader = ({
  label,
  initialImage = '',
  onImageUpload
}: CloudflareImageUploaderProps) => {
  const [image, setImage] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState<string>(initialImage);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('file', file);

      // Gửi request đến API
      const response = await fetch('/api-upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải lên hình ảnh');
      }

      const data = await response.json();
      const imageUrl = data.url; // URL của hình ảnh đã tải lên

      setImage(imageUrl);
      onImageUpload(imageUrl);
    } catch (err) {
      console.error('Error uploading image:', err);

      // Fallback: Sử dụng base64 nếu API không hoạt động
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const base64String = event.target.result.toString();
          setImage(base64String);
          onImageUpload(base64String);
        }
      };
      reader.onerror = () => {
        setError('Đã xảy ra lỗi khi đọc file. Vui lòng thử lại sau.');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setError('Vui lòng nhập URL hình ảnh');
      return;
    }

    if (!imageUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      setError('URL không hợp lệ');
      return;
    }

    setError('');
    setImage(imageUrl);
    onImageUpload(imageUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (uploadMode === 'url') return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Tạo một sự kiện giả để sử dụng hàm handleFileChange
    const fileInputEl = fileInputRef.current;
    if (fileInputEl) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputEl.files = dataTransfer.files;

      // Kích hoạt sự kiện change
      const event = new Event('change', { bubbles: true });
      fileInputEl.dispatchEvent(event);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    if (uploadMode === 'file' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.imageUploader}>
      <label className={styles.label}>{label}</label>

      <div className={styles.uploadModeToggle}>
        <button
          type="button"
          className={`${styles.modeButton} ${uploadMode === 'file' ? styles.active : ''}`}
          onClick={() => setUploadMode('file')}
        >
          Tải lên file
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${uploadMode === 'url' ? styles.active : ''}`}
          onClick={() => setUploadMode('url')}
        >
          Nhập URL
        </button>
      </div>

      {uploadMode === 'file' ? (
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className={styles.fileInput}
            accept="image/*"
            onChange={handleFileChange}
          />

          {isUploading ? (
            <div className={styles.uploading}>
              <FaSpinner className={styles.spinner} />
              <span>Đang tải lên...</span>
            </div>
          ) : image ? (
            <div className={styles.previewContainer}>
              <img src={image} alt="Preview" className={styles.preview} />
              <div className={styles.overlay}>
                <span>Nhấn để thay đổi</span>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <FaCloudUploadAlt size={40} />
              <span>Kéo thả hình ảnh vào đây hoặc nhấn để chọn file</span>
              <small>PNG, JPG, GIF (tối đa 5MB)</small>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.urlInputContainer}>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Nhập URL hình ảnh"
            className={styles.urlInput}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className={styles.urlSubmitButton}
          >
            Áp dụng
          </button>

          {image && (
            <div className={styles.previewContainer}>
              <img src={image} alt="Preview" className={styles.preview} />
            </div>
          )}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CloudflareImageUploader;
