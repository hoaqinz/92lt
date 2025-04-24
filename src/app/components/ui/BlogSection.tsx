'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaChevronRight } from 'react-icons/fa';
import styles from './BlogSection.module.scss';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  views: number;
  category: string;
}

// Dữ liệu mẫu mặc định
const defaultPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
    excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
    image: 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=Win+Go+Guide',
    date: '15/07/2023',
    views: 1250,
    category: 'huong-dan'
  },
  {
    id: 'post-2',
    title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
    excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
    image: 'https://via.placeholder.com/600x400/1a1a1a/ffcc00?text=Top+Slots',
    date: '10/07/2023',
    views: 980,
    category: 'tin-tuc'
  },
  {
    id: 'post-3',
    title: 'Cách quản lý vốn hiệu quả khi chơi Casino trực tuyến',
    excerpt: 'Những bí quyết giúp bạn quản lý vốn một cách thông minh và hiệu quả khi chơi Casino.',
    image: 'https://via.placeholder.com/600x400/1a1a1a/00ff00?text=Money+Management',
    date: '05/07/2023',
    views: 820,
    category: 'meo-hay'
  },
  {
    id: 'post-4',
    title: 'Những sai lầm phổ biến khi chơi Bắn Cá và cách tránh',
    excerpt: 'Tránh những sai lầm này để nâng cao kỹ năng và tăng cơ hội chiến thắng khi chơi Bắn Cá.',
    image: 'https://via.placeholder.com/600x400/1a1a1a/00ccff?text=Fishing+Tips',
    date: '01/07/2023',
    views: 750,
    category: 'meo-hay'
  }
];

const BlogSection = () => {
  // Khởi tạo với dữ liệu mẫu mặc định
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultPosts);
  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lấy dữ liệu bài viết từ localStorage khi ở client-side
  useEffect(() => {
    if (isClient) {
      try {
        // Lấy dữ liệu từ localStorage
        const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');

        if (storedPosts.length > 0) {
          // Nếu có dữ liệu trong localStorage, sử dụng nó
          // Sắp xếp bài viết theo ngày (mới nhất trước)
          const sortedPosts = [...storedPosts].sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
          });

          // Lấy 4 bài viết mới nhất
          setBlogPosts(sortedPosts.slice(0, 4));
        } else {
          // Nếu không có dữ liệu trong localStorage, lưu dữ liệu mẫu
          localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    }
  }, [isClient]);

  return (
    <div className={styles.blogSection}>
      <div className={styles.blogHeader}>
        <h2 className="section-title">Blog</h2>
        <Link href="/blog" className={styles.viewAllLink}>
          Xem tất cả <FaChevronRight />
        </Link>
      </div>

      <div className={styles.blogGrid}>
        {blogPosts.map((post) => (
          <div key={post.id} className={styles.blogCard}>
            <div className={styles.blogImageWrapper}>
              <img src={post.image} alt={post.title} className={styles.blogImage} />
              <div className={styles.blogCategory}>
                {post.category === 'huong-dan' ? 'Hướng dẫn' :
                 post.category === 'tin-tuc' ? 'Tin tức' :
                 post.category === 'meo-hay' ? 'Mẹo hay' :
                 post.category === 'khuyen-mai' ? 'Khuyến mãi' : post.category}
              </div>
            </div>
            <div className={styles.blogContent}>
              <h3 className={styles.blogTitle}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
              </h3>
              <p className={styles.blogExcerpt}>{post.excerpt}</p>
              <div className={styles.blogMeta}>
                <span className={styles.blogDate}>
                  <FaCalendarAlt /> {post.date}
                </span>
                <span className={styles.blogViews}>
                  <FaEye /> {post.views}
                </span>
              </div>
              <Link href={`/blog/${post.id}`} className={styles.readMoreLink}>
                Đọc tiếp <FaChevronRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
