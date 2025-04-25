'use client';

import React, { useState, useEffect } from 'react';
import SimpleImageUploader from '../components/ui/SimpleImageUploader';
import styles from './page.module.scss';

export default function SimpleUploaderPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImages((prev) => [...prev, imageUrl]);
    
    // Lưu ảnh vào localStorage để sử dụng lâu dài
    try {
      const savedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
      savedImages.push(imageUrl);
      localStorage.setItem('uploadedImages', JSON.stringify(savedImages));
    } catch (error) {
      console.error('Lỗi khi lưu ảnh vào localStorage:', error);
    }
  };
  
  const handleDeleteImage = (index: number) => {
    // Xóa ảnh khỏi state
    setUploadedImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      
      // Cập nhật localStorage
      try {
        localStorage.setItem('uploadedImages', JSON.stringify(newImages));
      } catch (error) {
        console.error('Lỗi khi cập nhật localStorage:', error);
      }
      
      return newImages;
    });
  };

  // Tải ảnh đã lưu từ localStorage khi trang được tải
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
        if (savedImages.length > 0) {
          setUploadedImages(savedImages);
        }
      } catch (error) {
        console.error('Lỗi khi tải ảnh từ localStorage:', error);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1>Demo Tải Ảnh Lên (Giả lập)</h1>
      
      <div className={styles.uploaderContainer}>
        <SimpleImageUploader 
          onImageUpload={handleImageUpload}
          label="Tải ảnh lên (Giả lập)"
        />
      </div>
      
      {uploadedImages.length > 0 && (
        <div className={styles.imagesContainer}>
          <h2>Ảnh đã tải lên</h2>
          <div className={styles.imageGrid}>
            {uploadedImages.map((url, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={url} alt={`Uploaded ${index + 1}`} />
                <div className={styles.imageInfo}>
                  <div className={styles.imageHeader}>
                    <p>Ảnh #{index + 1}</p>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteImage(index)}
                      title="Xóa ảnh"
                    >
                      ×
                    </button>
                  </div>
                  <p>Đây là ảnh Base64 (có thể lưu trữ và sử dụng lâu dài)</p>
                  <p className={styles.base64Preview}>
                    {url.substring(0, 50)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
