'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import styles from './editor.module.scss';
import CloudflareImageUploader from '@/app/components/ui/CloudflareImageUploader';

// Import React Quill động để tránh lỗi SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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

  // Cấu hình cho React Quill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

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
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      try {
        // Gửi request đến API để lưu bài viết
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Lỗi khi lưu bài viết');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);

        // Fallback: Sử dụng localStorage nếu API không hoạt động
        const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
        const updatedPosts = [newPost, ...existingPosts];
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
      }

      // Chuyển hướng đến trang danh sách bài viết
      setTimeout(() => {
        router.push('/admin/posts');
      }, 500);
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

  return (
    <div className={styles.editorPage}>
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

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form className={styles.editorForm}>
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
          <CloudflareImageUploader
            initialImage={featuredImage}
            onImageUpload={handleImageUpload}
            label="Ảnh đại diện"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="news">Tin tức</option>
            <option value="guide">Hướng dẫn</option>
            <option value="promotion">Khuyến mãi</option>
            <option value="event">Sự kiện</option>
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
          <div className={styles.editorContainer}>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Nhập nội dung bài viết..."
              theme="snow"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
