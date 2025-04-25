'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.scss';

// Dữ liệu mẫu cho thống kê
const defaultStats = {
  posts: 12,
  banners: 5,
  icons: 24,
  promotions: 8
};

// Dữ liệu mẫu cho hoạt động gần đây
const defaultActivities = [
  { id: 1, time: 'Hôm nay, 10:30', description: 'Thêm mới banner "Khuyến mãi tháng 4"' },
  { id: 2, time: 'Hôm nay, 09:15', description: 'Cập nhật bài viết "Hướng dẫn đăng ký tài khoản"' },
  { id: 3, time: 'Hôm qua, 16:45', description: 'Thêm mới icon "WinGo"' },
  { id: 4, time: 'Hôm qua, 14:20', description: 'Cập nhật khuyến mãi "Thưởng nạp lần đầu"' },
  { id: 5, time: '22/04/2023, 11:05', description: 'Thêm mới bài viết "Top 5 game được yêu thích nhất"' }
];

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [activities, setActivities] = useState(defaultActivities);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (typeof window !== 'undefined') {
      // Kiểm tra xem localStorage có khả dụng không
      const isLocalStorageAvailable = () => {
        try {
          const testKey = '__test__';
          localStorage.setItem(testKey, testKey);
          localStorage.removeItem(testKey);
          return true;
        } catch (e) {
          return false;
        }
      };
      
      // Kiểm tra xem sessionStorage có khả dụng không
      const isSessionStorageAvailable = () => {
        try {
          const testKey = '__test__';
          sessionStorage.setItem(testKey, testKey);
          sessionStorage.removeItem(testKey);
          return true;
        } catch (e) {
          return false;
        }
      };
      
      // Kiểm tra cookie
      const getCookieValue = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
      };
      
      let authData = null;
      
      // Thử lấy từ localStorage nếu có thể
      if (isLocalStorageAvailable()) {
        authData = localStorage.getItem('adminAuth');
        console.log('Auth data from localStorage:', authData ? 'Found' : 'Not found');
      } else {
        console.log('localStorage is not available (possibly in incognito mode)');
        // Sử dụng cookie nếu localStorage không khả dụng
        authData = getCookieValue('adminAuth');
        console.log('Using cookie for auth:', authData ? 'Found' : 'Not found');
      }
      
      if (!authData) {
        console.log('No auth data found, redirecting to login');
        // Thêm một flag để tránh chuyển hướng nhiều lần
        let redirectFlag = false;
        
        if (isSessionStorageAvailable()) {
          redirectFlag = sessionStorage.getItem('redirecting');
          if (!redirectFlag) {
            sessionStorage.setItem('redirecting', 'true');
          }
        }
        
        if (!redirectFlag && !getCookieValue('redirecting')) {
          // Sử dụng cookie làm flag nếu sessionStorage không khả dụng
          document.cookie = 'redirecting=true; path=/; max-age=10'; // Chỉ tồn tại 10 giây
          window.location.href = '/admin/login';
        }
        return;
      }

      try {
        const parsedData = JSON.parse(authData);
        const { isLoggedIn, timestamp } = parsedData;
        const now = new Date().getTime();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 giờ
        
        if (!isLoggedIn || now - timestamp > expirationTime) {
          console.log('Auth expired or invalid');
          // Thêm một flag để tránh chuyển hướng nhiều lần
          let redirectFlag = false;
          
          if (isSessionStorageAvailable()) {
            redirectFlag = sessionStorage.getItem('redirecting');
            if (!redirectFlag) {
              sessionStorage.setItem('redirecting', 'true');
            }
          }
          
          if (!redirectFlag && !getCookieValue('redirecting')) {
            // Sử dụng cookie làm flag nếu sessionStorage không khả dụng
            document.cookie = 'redirecting=true; path=/; max-age=10'; // Chỉ tồn tại 10 giây
            window.location.href = '/admin/login';
          }
        }
      } catch (err) {
        console.error('Error parsing auth data:', err);
        // Thêm một flag để tránh chuyển hướng nhiều lần
        let redirectFlag = false;
        
        if (isSessionStorageAvailable()) {
          redirectFlag = sessionStorage.getItem('redirecting');
          if (!redirectFlag) {
            sessionStorage.setItem('redirecting', 'true');
          }
        }
        
        if (!redirectFlag && !getCookieValue('redirecting')) {
          // Sử dụng cookie làm flag nếu sessionStorage không khả dụng
          document.cookie = 'redirecting=true; path=/; max-age=10'; // Chỉ tồn tại 10 giây
          window.location.href = '/admin/login';
        }
      }
    }
    
    // Xóa flag redirecting khi component unmount
    return () => {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('redirecting');
        } catch (e) {
          console.log('sessionStorage is not available');
        }
        // Xóa cookie flag
        document.cookie = 'redirecting=; path=/; max-age=0';
      }
    };
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Tổng số bài viết</h3>
          <div className={styles.statValue}>{stats.posts}</div>
        </div>
        
        <div className={styles.statCard}>
          <h3>Banners hoạt động</h3>
          <div className={styles.statValue}>{stats.banners}</div>
        </div>
        
        <div className={styles.statCard}>
          <h3>Icons</h3>
          <div className={styles.statValue}>{stats.icons}</div>
        </div>
        
        <div className={styles.statCard}>
          <h3>Khuyến mãi</h3>
          <div className={styles.statValue}>{stats.promotions}</div>
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h2>Hoạt động gần đây</h2>
        <ul className={styles.activityList}>
          {activities.map(activity => (
            <li key={activity.id} className={styles.activityItem}>
              <div className={styles.activityTime}>{activity.time}</div>
              <div className={styles.activityDescription}>{activity.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
