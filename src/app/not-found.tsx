'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './not-found.module.scss';

export default function NotFound() {
  // Xử lý các yêu cầu prefetch để tránh lỗi 404
  useEffect(() => {
    // Thêm một event listener để bắt các lỗi fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      // Kiểm tra nếu yêu cầu là cho tệp .txt và có tham số _rsc
      if (
        typeof input === 'string' && 
        (input.endsWith('.txt') || input.includes('_rsc='))
      ) {
        // Trả về phản hồi trống với mã trạng thái 200
        return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      
      // Nếu không, sử dụng fetch gốc
      return originalFetch.apply(this, arguments);
    };
    
    // Cleanup khi component unmount
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link href="/" className={styles.homeLink}>
        Quay lại trang chủ
      </Link>
    </div>
  );
}
