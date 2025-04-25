'use client';

import { useState } from 'react';
import ImageUploader from '../components/ui/ImageUploader';
import styles from './test-upload.module.scss';

export default function TestUploadPage() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setUploadStatus('Tải ảnh lên thành công!');
    setError('');
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setUploadStatus('');
  };

  return (
    <div className={styles.container}>
      <h1>Kiểm tra tải ảnh lên</h1>
      
      <div className={styles.uploadSection}>
        <h2>Tải ảnh lên Cloudflare Images</h2>
        <ImageUploader 
          onImageUpload={handleImageUpload}
          onError={handleUploadError}
        />
      </div>
      
      {uploadStatus && (
        <div className={styles.successMessage}>
          <p>{uploadStatus}</p>
          <div className={styles.imagePreview}>
            <img src={imageUrl} alt="Uploaded" />
          </div>
          <p>URL ảnh: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          <p>Lỗi: {error}</p>
        </div>
      )}
      
      <div className={styles.debugInfo}>
        <h3>Thông tin debug</h3>
        <p>Để kiểm tra lỗi, mở Console trong Developer Tools (F12)</p>
      </div>
    </div>
  );
}
