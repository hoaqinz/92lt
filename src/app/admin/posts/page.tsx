'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt } from 'react-icons/fa';
import styles from './posts.module.scss';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  category: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Dữ liệu mẫu mặc định
  const defaultPosts = [
    {
      id: 'post-1',
      title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
      excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
      date: '15/07/2023',
      views: 1250,
      category: 'huong-dan'
    },
    {
      id: 'post-2',
      title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
      excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
      date: '10/07/2023',
      views: 980,
      category: 'tin-tuc'
    },
    {
      id: 'post-3',
      title: 'Cách quản lý vốn hiệu quả khi chơi Casino trực tuyến',
      excerpt: 'Những bí quyết giúp bạn quản lý vốn một cách thông minh và hiệu quả khi chơi Casino.',
      date: '05/07/2023',
      views: 820,
      category: 'meo-hay'
    },
    {
      id: 'post-4',
      title: 'Những sai lầm phổ biến khi chơi Bắn Cá và cách tránh',
      excerpt: 'Tránh những sai lầm này để nâng cao kỹ năng và tăng cơ hội chiến thắng khi chơi Bắn Cá.',
      date: '01/07/2023',
      views: 750,
      category: 'meo-hay'
    }
  ];

  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
    setPosts(defaultPosts); // Khởi tạo với dữ liệu mẫu
    setLoading(false);
  }, []);

  // Lấy dữ liệu từ localStorage khi ở client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');

      if (storedPosts.length > 0) {
        // Nếu có dữ liệu trong localStorage, sử dụng nó
        setPosts(storedPosts);
      } else {
        // Nếu không có dữ liệu trong localStorage, lưu dữ liệu mẫu
        localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Đã xảy ra lỗi khi tải danh sách bài viết');
    }
  }, [isClient]);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (postToDelete && isClient) {
      try {
        // Lấy dữ liệu từ localStorage
        const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');

        // Lọc bỏ bài viết cần xóa
        const updatedPosts = storedPosts.filter((post: any) => post.id !== postToDelete);

        // Lưu lại vào localStorage
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

        // Cập nhật state
        setPosts(posts.filter(post => post.id !== postToDelete));

        // Đóng modal
        setShowDeleteModal(false);
        setPostToDelete(null);
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Đã xảy ra lỗi khi xóa bài viết');
      }
    } else {
      // Nếu chưa ở client-side, chỉ cập nhật state
      setPosts(posts.filter(post => post.id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Đang tải danh sách bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-alert error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.postsContainer}>
      <div className={styles.postsHeader}>
        <h3>Danh sách bài viết</h3>
        <Link href="/admin/posts/new" className="admin-btn primary">
          <FaPlus /> Thêm bài viết mới
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-alert info">
          <p>Chưa có bài viết nào. Hãy thêm bài viết mới!</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className={styles.titleCell}>
                  <div className={styles.postTitle}>{post.title}</div>
                  <div className={styles.postExcerpt}>{post.excerpt}</div>
                </td>
                <td>{post.category === 'huong-dan' ? 'Hướng dẫn' :
                     post.category === 'tin-tuc' ? 'Tin tức' :
                     post.category === 'meo-hay' ? 'Mẹo hay' :
                     post.category === 'khuyen-mai' ? 'Khuyến mãi' : post.category}</td>
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
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/posts/edit/${post.id}`} className={styles.editButton}>
                      <FaEdit /> Sửa
                    </Link>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(post.id)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
            <div className={styles.modalActions}>
              <button className="admin-btn secondary" onClick={cancelDelete}>
                Hủy bỏ
              </button>
              <button className="admin-btn danger" onClick={confirmDelete}>
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
