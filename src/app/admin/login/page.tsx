'use client';

import { useState, useEffect } from 'react';
import styles from './login.module.scss';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Kiểm tra nếu người dùng đã đăng nhập, chuyển hướng đến dashboard
    try {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        const parsedData = JSON.parse(authData);
        const { isLoggedIn, timestamp } = parsedData;
        const now = new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 giờ
        
        if (isLoggedIn && now - timestamp < expirationTime) {
          // Đã đăng nhập và chưa hết hạn
          console.log('Already logged in, redirecting to dashboard...');
          // Thêm một flag để tránh chuyển hướng nhiều lần
          if (!sessionStorage.getItem('redirecting')) {
            sessionStorage.setItem('redirecting', 'true');
            window.location.href = '/admin/dashboard';
          }
        }
      }
    } catch (err) {
      console.error('Error checking auth:', err);
    }
    
    // Xóa flag redirecting khi component unmount
    return () => {
      sessionStorage.removeItem('redirecting');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Trong môi trường thực tế, bạn sẽ gọi API để xác thực
      // Đây là mô phỏng xác thực đơn giản
      if (username === 'admin92lottery' && password === 'secure_password_123') {
        // Lưu trạng thái đăng nhập vào localStorage
        const authData = JSON.stringify({
          isLoggedIn: true,
          username: username,
          timestamp: new Date().getTime()
        });

        localStorage.setItem('adminAuth', authData);

        // Thiết lập cookie cho middleware
        document.cookie = `adminAuth=${authData}; path=/; max-age=${24 * 60 * 60}`;

        console.log('Login successful, redirecting...');

        // Chuyển hướng đến trang admin sau một khoảng thời gian ngắn
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 500);
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>92LOTTERY</h1>
          <h2>Đăng nhập Admin</h2>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>© 2023 92LOTTERY Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
