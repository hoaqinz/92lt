'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Lấy dữ liệu bài viết từ localStorage
    try {
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts) as Post[];
        
        // Tìm bài viết theo slug
        const foundPost = parsedPosts.find(p => p.slug === slug && p.status === 'published');
        
        if (foundPost) {
          setPost(foundPost);
          
          // Tìm các bài viết liên quan (cùng danh mục)
          const related = parsedPosts
            .filter(p => p.category === foundPost.category && p.id !== foundPost.id && p.status === 'published')
            .slice(0, 3);
          
          setRelatedPosts(related);
        } else {
          // Nếu không tìm thấy bài viết, chuyển hướng về trang danh sách
          router.push('/posts');
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, router]);

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
