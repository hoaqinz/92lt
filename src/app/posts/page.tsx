'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

  useEffect(() => {
    // Lấy dữ liệu bài viết từ localStorage
    try {
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // Chỉ hiển thị các bài viết đã xuất bản
        const publishedPosts = parsedPosts.filter((post: Post) => post.status === 'published');
        setPosts(publishedPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.postsPage}>
      <div className={styles.pageHeader}>
        <h1>Bài viết</h1>
        <p>Tin tức và cập nhật mới nhất từ 92LOTTERY</p>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Chưa có bài viết nào.</p>
        </div>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postImageContainer}>
                <img 
                  src={post.featuredImage || 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=92LOTTERY'} 
                  alt={post.title} 
                  className={styles.postImage} 
                />
                <div className={styles.postCategory}>{post.category}</div>
              </div>
              <div className={styles.postContent}>
                <h2 className={styles.postTitle}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>
                <div className={styles.postMeta}>
                  <span className={styles.postAuthor}>{post.author}</span>
                  <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                </div>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <Link href={`/posts/${post.slug}`} className={styles.readMoreLink}>
                  Đọc tiếp
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
