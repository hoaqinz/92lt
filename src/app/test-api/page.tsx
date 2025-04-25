'use client';

import { useState, useRef } from 'react';
import styles from './test-api.module.scss';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTestApi = async () => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Thông tin xác thực Cloudflare
      const accountId = '04725e5acc15b760fb22bf197ff9799f';
      const apiToken = 'JZYoQdkbYec97Na325HqQwEJAUn12Wh_tw6iUtPp';

      // Gửi request đến Cloudflare API để kiểm tra kết nối
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/direct_upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          requireSignedURLs: false,
          metadata: {
            test: 'true'
          }
        })
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error testing API:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi test API');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      setError('Vui lòng chọn file');
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

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('file', file);

      // Gửi request đến Cloudflare Images API
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        body: formData
      });

      const data = await response.json();
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
      <h1>Test Cloudflare API</h1>

      <div className={styles.section}>
        <h2>Test kết nối API</h2>
        <button 
          onClick={handleTestApi} 
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? 'Đang xử lý...' : 'Test API'}
        </button>
      </div>

      <div className={styles.section}>
        <h2>Test tải file lên</h2>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className={styles.fileInput}
        />
        <button 
          onClick={handleFileUpload} 
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? 'Đang tải lên...' : 'Tải file lên'}
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
        </div>
      )}
    </div>
  );
}
