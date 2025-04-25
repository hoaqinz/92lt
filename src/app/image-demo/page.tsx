'use client';

import { useState } from 'react';
import DirectImageUploader from '../components/ui/DirectImageUploader';
import styles from './page.module.scss';

export default function ImageDemoPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImages((prev) => [...prev, imageUrl]);
  };

  return (
    <div className={styles.container}>
      <h1>Demo Tải Ảnh Lên</h1>
      
      <div className={styles.uploaderContainer}>
        <DirectImageUploader 
          onImageUpload={handleImageUpload}
          label="Tải ảnh lên Cloudflare Images"
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
                  <p>URL: {url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
