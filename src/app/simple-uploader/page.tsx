'use client';

import { useState } from 'react';
import SimpleImageUploader from '../components/ui/SimpleImageUploader';
import styles from './page.module.scss';

export default function SimpleUploaderPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImages((prev) => [...prev, imageUrl]);
  };

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
