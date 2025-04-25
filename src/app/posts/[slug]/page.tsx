import React from 'react';
import Link from 'next/link';
import styles from './post.module.scss';

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
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ff0000?text=Win+Go+Guide',
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
    featuredImage: 'https://via.placeholder.com/1200x600/1a1a1a/ffcc00?text=Top+Slots',
    category: 'Tin tức',
    author: 'Admin',
    createdAt: '2023-07-10T00:00:00Z',
    updatedAt: '2023-07-10T00:00:00Z',
    status: 'published'
  }
];

// Hàm này cần thiết cho static export với dynamic routes
export function generateStaticParams() {
  // Trong môi trường build, trả về danh sách các slug từ dữ liệu mẫu
  return samplePosts.map(post => ({
    slug: post.slug,
  }));
}

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Tìm bài viết theo slug từ dữ liệu mẫu
  const post = samplePosts.find(p => p.slug === slug);
  
  // Tìm các bài viết liên quan (cùng danh mục)
  const relatedPosts = post 
    ? samplePosts.filter(p => p.category === post.category && p.id !== post.id)
    : [];

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (!post) {
    return (
      <div className={styles.notFound}>
        <h1>Không tìm thấy bài viết</h1>
        <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/posts" className={styles.backButton}>
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.postDetailPage}>
      <div className={styles.postHeader}>
        <Link href="/posts" className={styles.backLink}>
          ← Quay lại danh sách bài viết
        </Link>
        <div className={styles.postCategory}>{post.category}</div>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>
          <span className={styles.postAuthor}>{post.author}</span>
          <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {post.featuredImage && (
        <div className={styles.postFeaturedImage}>
          <img src={post.featuredImage} alt={post.title} />
        </div>
      )}

      <div 
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedPosts.length > 0 && (
        <div className={styles.relatedPosts}>
          <h2>Bài viết liên quan</h2>
          <div className={styles.relatedPostsGrid}>
            {relatedPosts.map(relatedPost => (
              <div key={relatedPost.id} className={styles.relatedPostCard}>
                <div className={styles.relatedPostImage}>
                  <img 
                    src={relatedPost.featuredImage || 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=92LOTTERY'} 
                    alt={relatedPost.title} 
                  />
                </div>
                <div className={styles.relatedPostContent}>
                  <h3 className={styles.relatedPostTitle}>
                    <Link href={`/posts/${relatedPost.slug}`}>{relatedPost.title}</Link>
                  </h3>
                  <div className={styles.relatedPostMeta}>
                    <span>{formatDate(relatedPost.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
