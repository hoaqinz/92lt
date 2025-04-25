import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

// Dữ liệu mẫu cho các bài viết blog
const blogPosts = [
  {
    id: 'post-1',
    title: 'Hướng dẫn cách chơi Win Go hiệu quả nhất',
    excerpt: 'Tìm hiểu các chiến thuật và mẹo chơi Win Go để tăng cơ hội chiến thắng của bạn.',
    category: 'Hướng dẫn',
    date: '15/07/2023',
    views: 1250,
    image: 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=Win+Go+Guide'
  },
  {
    id: 'post-2',
    title: 'Top 10 game Slots được yêu thích nhất tháng 7/2023',
    excerpt: 'Khám phá những game Slots hot nhất và được người chơi yêu thích trong tháng này.',
    category: 'Tin tức',
    date: '10/07/2023',
    views: 980,
    image: 'https://via.placeholder.com/600x400/1a1a1a/ffcc00?text=Top+Slots'
  },
  {
    id: 'post-3',
    title: 'Cách quản lý vốn hiệu quả khi chơi Casino trực tuyến',
    excerpt: 'Những bí quyết giúp bạn quản lý vốn một cách thông minh và hiệu quả khi chơi Casino.',
    category: 'Mẹo hay',
    date: '05/07/2023',
    views: 820,
    image: 'https://via.placeholder.com/600x400/1a1a1a/00ff00?text=Money+Management'
  },
  {
    id: 'post-4',
    title: 'Những sai lầm phổ biến khi chơi Bắn Cá và cách tránh',
    excerpt: 'Tránh những sai lầm này để nâng cao kỹ năng và tăng cơ hội chiến thắng khi chơi Bắn Cá.',
    category: 'Mẹo hay',
    date: '01/07/2023',
    views: 750,
    image: 'https://via.placeholder.com/600x400/1a1a1a/00ccff?text=Fishing+Tips'
  }
];

export default function BlogPage() {
  return (
    <div className={styles.blogPage}>
      <div className={styles.blogHeader}>
        <h1>Blog</h1>
        <p>Tin tức, hướng dẫn và mẹo hay về 92LOTTERY</p>
      </div>

      <div className={styles.blogGrid}>
        {blogPosts.map((post) => (
          <div key={post.id} className={styles.blogCard}>
            <div className={styles.blogImageWrapper}>
              <img src={post.image} alt={post.title} className={styles.blogImage} />
              <div className={styles.blogCategory}>{post.category}</div>
            </div>
            <div className={styles.blogContent}>
              <h3 className={styles.blogTitle}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
              </h3>
              <p className={styles.blogExcerpt}>{post.excerpt}</p>
              <div className={styles.blogMeta}>
                <span className={styles.blogDate}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
                  </svg> {post.date}
                </span>
                <span className={styles.blogViews}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path>
                  </svg> {post.views}
                </span>
              </div>
              <Link href={`/blog/${post.id}`} className={styles.readMoreLink}>
                Đọc tiếp <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
