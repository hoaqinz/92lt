'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './test-direct.module.scss';

export default function TestDirectPage() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kiểm tra xem script đã được tải chưa
  useEffect(() => {
    const checkScriptLoaded = () => {
      if (typeof window !== 'undefined' && window.uploadToCloudflareImages) {
        setIsScriptLoaded(true);
        return true;
      }
      return false;
    };

    if (!checkScriptLoaded()) {
      const interval = setInterval(() => {
        if (checkScriptLoaded()) {
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, []);

  const handleDirectUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      setError('Vui lòng chọn file');
      return;
    }

    if (!isScriptLoaded) {
      setError('Script uploadToCloudflareImages chưa được tải');
      return;
    }

    const file = fileInputRef.current.files[0];
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Thông tin xác thực Cloudflare
      const accountId = '04725e5acc15b760fb22bf197ff9799f';
      const apiToken = 'JZYoQdkbYec97Na325HqQwEJAUn12Wh_tw6iUtPp';

      // Gọi hàm uploadToCloudflareImages
      const data = await window.uploadToCloudflareImages(file, accountId, apiToken);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải file lên');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Test Direct Upload</h1>

      <div className={styles.section}>
        <h2>Test uploadToCloudflareImages</h2>
        <div className={styles.status}>
          Script status: {isScriptLoaded ? (
            <span className={styles.loaded}>Đã tải</span>
          ) : (
            <span className={styles.notLoaded}>Chưa tải</span>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className={styles.fileInput}
        />
        <button 
          onClick={handleDirectUpload} 
          disabled={isLoading || !isScriptLoaded}
          className={styles.button}
        >
          {isLoading ? 'Đang tải lên...' : 'Tải file lên trực tiếp'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <h3>Lỗi:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h3>Kết quả:</h3>
          <pre>{result}</pre>
          {JSON.parse(result).url && (
            <div className={styles.imagePreview}>
              <h4>Xem trước ảnh:</h4>
              <img src={JSON.parse(result).url} alt="Uploaded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
