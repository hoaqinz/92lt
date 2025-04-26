'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes } from 'react-icons/fa';
import DirectUploader from '@/app/components/ui/DirectUploader';
import styles from '../../new/editor.module.scss';

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    featuredImage: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const post = await response.json();
        setFormData({
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          category: post.category,
          featuredImage: post.featuredImage || '',
          status: post.status || 'draft'
        });
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      setSuccess('Post updated successfully!');
      setTimeout(() => {
        router.push('/admin/posts');
      }, 2000);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const categories = [
    { id: 'news', name: 'Tin tức' },
    { id: 'guide', name: 'Hướng dẫn' },
    { id: 'promotion', name: 'Khuyến mãi' },
    { id: 'event', name: 'Sự kiện' }
  ];

  return (
    <div className={styles.editor}>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Tóm tắt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label>Ảnh đại diện</label>
          <DirectUploader
            onUploadComplete={handleImageUpload}
            className={styles.uploader}
          />
          {formData.featuredImage && (
            <div className={styles.imagePreview}>
              <img src={formData.featuredImage} alt="Featured" />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            required
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelButton}
            disabled={loading}
          >
            <FaTimes /> Hủy
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={loading}
          >
            <FaSave /> {loading ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
}
