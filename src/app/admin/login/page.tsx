'use client';

import styles from './login.module.scss';

export default function AdminLogin() {
  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const errorElement = document.getElementById('error-message');

    if (username === 'admin92lottery' && password === 'secure_password_123') {
      // Lưu trạng thái đăng nhập vào localStorage
      const authData = JSON.stringify({
        isLoggedIn: true,
        username: username,
        timestamp: new Date().getTime()
      });

      localStorage.setItem('adminAuth', authData);

      // Thiết lập cookie
      document.cookie = `adminAuth=${authData}; path=/; max-age=${24 * 60 * 60}`;

      // Chuyển hướng đến trang admin
      window.location.href = '/admin/dashboard';
    } else {
      if (errorElement) {
        errorElement.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng';
        errorElement.style.display = 'block';
      }
    }

    return false;
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>92LOTTERY</h1>
          <h2>Đăng nhập Admin</h2>
        </div>

        <div id="error-message" className={styles.errorMessage} style={{display: 'none'}}></div>

        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            className={styles.loginButton}
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </div>

        <div className={styles.loginFooter}>
          <p>© 2023 92LOTTERY Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
