'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import styles from './editor.module.scss';
import DirectUploader from '@/app/components/ui/DirectUploader';

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

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('news');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tạo slug từ tiêu đề
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  // Xử lý khi tải ảnh lên
  const handleImageUpload = (imageUrl: string) => {
    setFeaturedImage(imageUrl);
  };

  // Lưu bài viết
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      if (!title || !content) {
        throw new Error('Vui lòng nhập tiêu đề và nội dung bài viết');
      }

      // Tạo slug từ tiêu đề
      const slug = createSlug(title);

      // Tạo bài viết mới
      const newPost: Post = {
        id: Date.now(),
        title,
        slug,
        content,
        excerpt: excerpt || title,
        featuredImage,
        category,
        author: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status
      };

      // Lưu vào localStorage
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));

      setSuccess('Bài viết đã được lưu thành công!');

      // Chuyển hướng đến trang danh sách bài viết sau 1 giây
      setTimeout(() => {
        router.push('/admin/posts');
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Đã xảy ra lỗi khi lưu bài viết');
      }
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { id: 'news', name: 'Tin tức' },
    { id: 'guide', name: 'Hướng dẫn' },
    { id: 'promotion', name: 'Khuyến mãi' },
    { id: 'event', name: 'Sự kiện' }
  ];

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/admin/posts')}
        >
          <FaArrowLeft /> Quay lại
        </button>
        <button
          className={styles.saveButton}
          onClick={handleSavePost}
          disabled={isSaving}
        >
          <FaSave /> {isSaving ? 'Đang lưu...' : 'Lưu bài viết'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Tóm tắt</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Nhập tóm tắt bài viết (tùy chọn)"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Ảnh đại diện</label>
          <DirectUploader
            onUploadComplete={handleImageUpload}
            className={styles.uploader}
          />
          {featuredImage && (
            <div className={styles.imagePreview}>
              <img src={featuredImage} alt="Featured" />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            required
            placeholder="Nhập nội dung bài viết..."
          />
        </div>
      </form>
    </div>
  );
}
