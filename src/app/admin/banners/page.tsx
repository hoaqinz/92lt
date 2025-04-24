'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styles from './banners.module.scss';

interface Banner {
  id: string;
  image: string;
  link: string;
  title: string;
  active: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState<Banner>({
    id: '',
    image: '',
    link: '',
    title: '',
    active: true
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  // Dữ liệu mẫu mặc định
  const defaultBanners: Banner[] = [
    {
      id: 'banner-1',
      image: 'https://gwfd.qatgwawm.net/system-assets/PortalManagement/Image/SlideShow/d574c531cd1b46a0b3fe31efacd33435.jpg',
      link: '#',
      title: '',
      active: true
    },
    {
      id: 'banner-2',
      image: 'https://via.placeholder.com/1200x400/1a1a1a/ffcc00?text=Banner+2',
      link: '#',
      title: '',
      active: true
    },
    {
      id: 'banner-3',
      image: 'https://via.placeholder.com/1200x400/1a1a1a/00ff00?text=Banner+3',
      link: '#',
      title: '',
      active: true
    }
  ];

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
    setBanners(defaultBanners); // Khởi tạo với dữ liệu mẫu
    setLoading(false);
  }, []);

  // Lấy dữ liệu từ localStorage khi ở client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedBanners = JSON.parse(localStorage.getItem('siteBanners') || '[]');

      if (storedBanners.length > 0) {
        // Nếu có dữ liệu trong localStorage, sử dụng nó
        setBanners(storedBanners);
      } else {
        // Nếu không có dữ liệu trong localStorage, lưu dữ liệu mẫu
        localStorage.setItem('siteBanners', JSON.stringify(defaultBanners));
      }
    } catch (err) {
      console.error('Error loading banners:', err);
      setError('Đã xảy ra lỗi khi tải danh sách banner');
    }
  }, [isClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setNewBanner(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddBanner = () => {
    if (!newBanner.image) {
      setError('Vui lòng nhập URL hình ảnh banner');
      return;
    }

    if (!isClient) {
      setError('Không thể thêm banner ở chế độ server-side');
      return;
    }

    try {
      const newBannerWithId = {
        ...newBanner,
        id: `banner-${Date.now()}`
      };

      const updatedBanners = [...banners, newBannerWithId];
      setBanners(updatedBanners);

      // Lưu vào localStorage
      localStorage.setItem('siteBanners', JSON.stringify(updatedBanners));

      // Reset form
      setNewBanner({
        id: '',
        image: '',
        link: '',
        title: '',
        active: true
      });

      setSuccess('Thêm banner mới thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding banner:', err);
      setError('Đã xảy ra lỗi khi thêm banner');
    }
  };

  const handleDeleteClick = (bannerId: string) => {
    setBannerToDelete(bannerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete && isClient) {
      try {
        const updatedBanners = banners.filter(banner => banner.id !== bannerToDelete);
        setBanners(updatedBanners);

        // Lưu vào localStorage
        localStorage.setItem('siteBanners', JSON.stringify(updatedBanners));

        setShowDeleteModal(false);
        setBannerToDelete(null);
        setSuccess('Xóa banner thành công!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting banner:', err);
        setError('Đã xảy ra lỗi khi xóa banner');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBannerToDelete(null);
  };

  const handleToggleActive = (bannerId: string) => {
    if (!isClient) return;

    try {
      const updatedBanners = banners.map(banner => {
        if (banner.id === bannerId) {
          return { ...banner, active: !banner.active };
        }
        return banner;
      });

      setBanners(updatedBanners);

      // Lưu vào localStorage
      localStorage.setItem('siteBanners', JSON.stringify(updatedBanners));
    } catch (err) {
      console.error('Error toggling banner status:', err);
      setError('Đã xảy ra lỗi khi cập nhật trạng thái banner');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !isClient) return;

    try {
      const updatedBanners = [...banners];
      [updatedBanners[index], updatedBanners[index - 1]] = [updatedBanners[index - 1], updatedBanners[index]];

      setBanners(updatedBanners);

      // Lưu vào localStorage
      localStorage.setItem('siteBanners', JSON.stringify(updatedBanners));
    } catch (err) {
      console.error('Error moving banner:', err);
      setError('Đã xảy ra lỗi khi di chuyển banner');
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1 || !isClient) return;

    try {
      const updatedBanners = [...banners];
      [updatedBanners[index], updatedBanners[index + 1]] = [updatedBanners[index + 1], updatedBanners[index]];

      setBanners(updatedBanners);

      // Lưu vào localStorage
      localStorage.setItem('siteBanners', JSON.stringify(updatedBanners));
    } catch (err) {
      console.error('Error moving banner:', err);
      setError('Đã xảy ra lỗi khi di chuyển banner');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.bannersContainer}>
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

      <div className="admin-card">
        <h3>Thêm banner mới</h3>
        <div className="admin-form">
          <div className="form-group">
            <label htmlFor="image">URL hình ảnh *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={newBanner.image}
              onChange={handleInputChange}
              placeholder="Nhập URL hình ảnh banner"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Tiêu đề (tùy chọn)</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newBanner.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề banner (để trống nếu chỉ muốn hiển thị hình ảnh)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Liên kết</label>
            <input
              type="text"
              id="link"
              name="link"
              value={newBanner.link}
              onChange={handleInputChange}
              placeholder="Nhập liên kết khi click vào banner"
            />
          </div>

          <div className="form-group">
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="active"
                checked={newBanner.active}
                onChange={handleInputChange}
              />
              Hiển thị banner
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="admin-btn primary"
              onClick={handleAddBanner}
            >
              <FaPlus /> Thêm banner
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Danh sách banner</h3>
        {banners.length === 0 ? (
          <div className="admin-alert info">
            <p>Chưa có banner nào. Hãy thêm banner mới!</p>
          </div>
        ) : (
          <div className={styles.bannersList}>
            {banners.map((banner, index) => (
              <div key={banner.id} className={styles.bannerItem}>
                <div className={styles.bannerPreview}>
                  <img src={banner.image} alt={banner.title} />
                  <div className={styles.bannerOverlay}>
                    <h4>{banner.title}</h4>
                    <p>Link: {banner.link || '#'}</p>
                    <p>Trạng thái: {banner.active ? 'Hiển thị' : 'Ẩn'}</p>
                  </div>
                </div>
                <div className={styles.bannerActions}>
                  <button
                    className={`${styles.actionButton} ${styles.toggleButton} ${banner.active ? styles.active : styles.inactive}`}
                    onClick={() => handleToggleActive(banner.id)}
                    title={banner.active ? 'Ẩn banner' : 'Hiển thị banner'}
                  >
                    {banner.active ? 'Hiển thị' : 'Ẩn'}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.moveButton}`}
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Di chuyển lên"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.moveButton}`}
                    onClick={() => handleMoveDown(index)}
                    disabled={index === banners.length - 1}
                    title="Di chuyển xuống"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteClick(banner.id)}
                    title="Xóa banner"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa banner này không? Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
              <button className="admin-btn secondary" onClick={cancelDelete}>
                Hủy bỏ
              </button>
              <button className="admin-btn danger" onClick={confirmDelete}>
                Xóa banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
