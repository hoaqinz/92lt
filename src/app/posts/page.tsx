import React from 'react';
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

// Dữ liệu mẫu cho các bài viết
const samplePosts: Post[] = [
  {
    id: 1,
    title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
    slug: 'huong-dan-choi-win-go',
    content: '<p>Win Go là một trong những trò chơi xổ số phổ biến nhất tại 92LOTTERY...</p>',
    excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
    featuredImage: 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=Win+Go+Guide',
    category: 'Hướng dẫn',
    author: 'Admin',
    createdAt: '2023-07-15T00:00:00Z',
    updatedAt: '2023-07-15T00:00:00Z',
    status: 'published'
  },
  {
    id: 2,
    title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
    slug: 'top-10-game-slots',
    content: '<p>Slots là một trong những thể loại game casino phổ biến nhất tại 92LOTTERY...</p>',
    excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
    featuredImage: 'https://via.placeholder.com/600x400/1a1a1a/ffcc00?text=Top+Slots',
    category: 'Tin tức',
    author: 'Admin',
    createdAt: '2023-07-10T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z',
    status: 'published'
  }
];

export default function PostsPage() {
  // Sử dụng dữ liệu mẫu thay vì lấy từ localStorage
  const posts = samplePosts;

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

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
