'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './posts.module.scss';

// Định nghĩa kiểu dữ liệu cho bài viết
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lấy danh sách bài viết từ localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      // Lấy dữ liệu từ localStorage
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải bài viết');
    } finally {
      setIsLoading(false);
    }
  }, [isClient]);

  // Xóa bài viết
  const handleDeletePost = (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      // Lấy dữ liệu từ localStorage
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // Lọc bỏ bài viết cần xóa
        const updatedPosts = parsedPosts.filter((post: Post) => post.id !== id);
        // Lưu lại vào localStorage
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        // Cập nhật state
        setPosts(updatedPosts);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa bài viết');
    }
  };

  // Thay đổi trạng thái bài viết
  const handleToggleStatus = (post: Post) => {
    try {
      const updatedPost = {
        ...post,
        status: post.status === 'published' ? 'draft' : 'published',
        updatedAt: new Date().toISOString()
      };

      // Lấy dữ liệu từ localStorage
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // Cập nhật bài viết
        const updatedPosts = parsedPosts.map((p: Post) =>
          p.id === post.id ? updatedPost : p
        );
        // Lưu lại vào localStorage
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        // Cập nhật state
        setPosts(updatedPosts);
      }
    } catch (err) {
      console.error('Error updating post status:', err);
      alert(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật trạng thái bài viết');
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.postsContainer}>
      <div className={styles.header}>
        <h1>Quản lý bài viết</h1>
        <Link href="/admin/posts/new" className={styles.addButton}>
          <FaPlus /> Thêm bài viết mới
        </Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Chưa có bài viết nào. Hãy thêm bài viết mới.</p>
        </div>
      ) : (
        <div className={styles.postsTable}>
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td className={styles.postTitle}>
                    <div className={styles.titleWithImage}>
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className={styles.thumbnail}
                        />
                      )}
                      <div>
                        <Link href={`/admin/posts/edit/${post.id}`}>
                          {post.title}
                        </Link>
                        <div className={styles.excerpt}>{post.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td>{post.category}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[post.status]}`}>
                      {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleToggleStatus(post)}
                        title={post.status === 'published' ? 'Chuyển sang bản nháp' : 'Xuất bản'}
                      >
                        {post.status === 'published' ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className={styles.actionButton}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeletePost(post.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
