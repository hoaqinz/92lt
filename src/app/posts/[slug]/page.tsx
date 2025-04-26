'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostsAPI } from '@/app/api/cloudflare';
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

// Format ngày tháng
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Lấy bài viết theo slug
        const fetchedPost = await PostsAPI.getBySlug(params.slug);
        setPost(fetchedPost);

        // Lấy danh sách bài viết để tìm bài liên quan
        const allPosts = await PostsAPI.getAll();
        const related = allPosts
          .filter(p => p.category === fetchedPost.category && p.id !== fetchedPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.notFound}>
        <h1>Không tìm thấy bài viết</h1>
        <p>{error || 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'}</p>
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
                <Link href={`/posts/${relatedPost.slug}`}>
                  <div className={styles.relatedPostImage}>
                    <img 
                      src={relatedPost.featuredImage || 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=92LOTTERY'} 
                      alt={relatedPost.title} 
                    />
                  </div>
                  <div className={styles.relatedPostContent}>
                    <h3 className={styles.relatedPostTitle}>{relatedPost.title}</h3>
                    <div className={styles.relatedPostMeta}>
                      <span>{formatDate(relatedPost.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
