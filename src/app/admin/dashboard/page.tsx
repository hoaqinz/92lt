'use client';

import { useState, useEffect } from 'react';
import { FaNewspaper, FaEye, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import styles from './dashboard.module.scss';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    recentPosts: [],
    totalViews: 0
  });

  // Dữ liệu mẫu mặc định
  const defaultStats = {
    totalPosts: 4,
    recentPosts: [
      {
        id: 'post-1',
        title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
        date: '15/07/2023',
        views: 1250
      },
      {
        id: 'post-2',
        title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
        date: '10/07/2023',
        views: 980
      },
      {
        id: 'post-3',
        title: 'Cách quản lý vốn hiệu quả khi chơi Casino trực tuyến',
        date: '05/07/2023',
        views: 820
      },
      {
        id: 'post-4',
        title: 'Những sai lầm phổ biến khi chơi Bắn Cá và cách tránh',
        date: '01/07/2023',
        views: 750
      }
    ],
    totalViews: 3800
  };

  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
    setStats(defaultStats); // Khởi tạo với dữ liệu mẫu
  }, []);

  // Lấy dữ liệu từ localStorage khi ở client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');

      if (storedPosts.length === 0) return;

      // Tính tổng lượt xem
      const totalViews = storedPosts.reduce((sum: number, post: any) => sum + (post.views || 0), 0);

      // Sắp xếp bài viết theo ngày (mới nhất trước)
      const sortedPosts = [...storedPosts].sort((a: any, b: any) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });

      // Lấy 4 bài viết mới nhất
      const recentPosts = sortedPosts.slice(0, 4);

      const stats = {
        totalPosts: storedPosts.length,
        recentPosts,
        totalViews
      };

      setStats(stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, [isClient]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.posts}`}>
          <div className={styles.statIcon}>
            <FaNewspaper />
          </div>
          <div className={styles.statInfo}>
            <h3>Tổng số bài viết</h3>
            <p>{stats.totalPosts}</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.views}`}>
          <div className={styles.statIcon}>
            <FaEye />
          </div>
          <div className={styles.statInfo}>
            <h3>Tổng lượt xem</h3>
            <p>{stats.totalViews}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Bài viết gần đây</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <span className={styles.dateCell}>
                    <FaCalendarAlt /> {post.date}
                  </span>
                </td>
                <td>
                  <span className={styles.viewsCell}>
                    <FaEye /> {post.views}
                  </span>
                </td>
                <td className="actions">
                  <button className="edit" onClick={() => window.location.href = `/admin/posts/edit/${post.id}`}>
                    <FaEdit /> Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
