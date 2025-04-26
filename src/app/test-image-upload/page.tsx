'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]}: ${message}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      addLog(`File selected: ${selectedFile.name} (${selectedFile.size} bytes, ${selectedFile.type})`);
    }
  };

  const handleDirectUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file trước');
      return;
    }

    setLoading(true);
    setError(null);
    addLog('Starting direct upload...');

    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append('file', file);

      addLog(`Sending POST request to /api/upload`);
      
      // Gửi request trực tiếp đến API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      addLog(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Error response: ${errorText}`);
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      addLog(`Response data: ${JSON.stringify(data)}`);
      
      if (data.url) {
        setImageUrl(data.url);
        addLog(`Image uploaded successfully: ${data.url}`);
      } else {
        throw new Error('No URL in response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBase64Fallback = async () => {
    if (!file) {
      setError('Vui lòng chọn file trước');
      return;
    }

    setLoading(true);
    setError(null);
    addLog('Starting base64 encoding...');

    try {
      // Đọc file dưới dạng base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            resolve(event.target.result.toString());
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
      });
      
      reader.readAsDataURL(file);
      
      const base64Data = await base64Promise;
      addLog(`Base64 encoding successful, length: ${base64Data.length}`);
      
      setImageUrl(base64Data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">← Quay lại trang chủ</Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Test Upload Hình Ảnh</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Chọn hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700"
          />
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={handleDirectUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang tải lên...' : 'Tải lên qua API'}
          </button>
          
          <button
            onClick={handleBase64Fallback}
            disabled={!file || loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Chuyển đổi Base64 (Fallback)'}
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-900 text-white rounded mb-4">
            <p className="font-bold">Lỗi:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
      
      {imageUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Kết quả</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm mb-1">URL hình ảnh:</p>
              <div className="bg-gray-700 p-2 rounded overflow-x-auto">
                <code className="text-green-400 break-all">{imageUrl}</code>
              </div>
            </div>
            
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="max-w-full h-auto mx-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-bold mb-2">Logs</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="bg-black p-3 rounded h-64 overflow-y-auto font-mono text-sm">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400">{log}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Chưa có log nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
