'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes } from 'react-icons/fa';
import styles from './editor.module.scss';

const categories = [
  { id: 'huong-dan', name: 'Hướng dẫn' },
  { id: 'tin-tuc', name: 'Tin tức' },
  { id: 'meo-hay', name: 'Mẹo hay' },
  { id: 'khuyen-mai', name: 'Khuyến mãi' }
];

export default function NewPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Kiểm tra dữ liệu
      if (!formData.title || !formData.content || !formData.category) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      if (!isClient) {
        // Nếu chưa ở client-side, chỉ hiển thị thông báo thành công
        setSuccess('Bài viết đã được tạo thành công!');
        setLoading(false);
        return;
      }

      // Lưu bài viết vào localStorage để mô phỏng cơ sở dữ liệu
      const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const newPost = {
        id: `post-${Date.now()}`,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        image: formData.image || 'https://via.placeholder.com/600x400/1a1a1a/ff0000?text=Blog+Post',
        status: formData.status,
        date: new Date().toLocaleDateString('vi-VN'),
        views: 0
      };

      posts.push(newPost);
      localStorage.setItem('blogPosts', JSON.stringify(posts));

      setSuccess('Bài viết đã được tạo thành công!');

      // Chuyển hướng sau khi lưu thành công
      setTimeout(() => {
        window.location.href = '/admin/posts';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi lưu bài viết');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/admin/posts';
  };

  return (
    <div className={styles.editorContainer}>
      {error && (
        <div className="admin-alert error">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="admin-alert success">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-card">
          <h3>Thông tin bài viết</h3>

          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Mô tả ngắn</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Nhập mô tả ngắn cho bài viết"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Danh mục *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">URL hình ảnh đại diện</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Nhập URL hình ảnh đại diện"
            />
          </div>

          <div className="form-group">
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
        </div>

        <div className="admin-card">
          <h3>Nội dung bài viết *</h3>
          <div className={styles.editorWrapper}>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập nội dung bài viết..."
              className={styles.simpleEditor}
              rows={15}
            ></textarea>
            <div className={styles.editorHelp}>
              <p>Mẹo: Bạn có thể sử dụng HTML cơ bản để định dạng văn bản:</p>
              <ul>
                <li><code>&lt;h2&gt;Tiêu đề&lt;/h2&gt;</code> - Tiêu đề</li>
                <li><code>&lt;p&gt;Đoạn văn bản&lt;/p&gt;</code> - Đoạn văn bản</li>
                <li><code>&lt;strong&gt;Chữ đậm&lt;/strong&gt;</code> - <strong>Chữ đậm</strong></li>
                <li><code>&lt;em&gt;Chữ nghiêng&lt;/em&gt;</code> - <em>Chữ nghiêng</em></li>
                <li><code>&lt;ul&gt;&lt;li&gt;Danh sách&lt;/li&gt;&lt;/ul&gt;</code> - Danh sách</li>
                <li><code>&lt;a href="url"&gt;Liên kết&lt;/a&gt;</code> - Liên kết</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="admin-btn secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            <FaTimes /> Hủy bỏ
          </button>

          <button
            type="submit"
            className="admin-btn primary"
            disabled={loading}
          >
            <FaSave /> {loading ? 'Đang lưu...' : 'Lưu bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
}
