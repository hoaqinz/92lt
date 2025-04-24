'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './banners.module.scss';
import ImageUploader from '@/app/components/ui/ImageUploader';

// Định nghĩa kiểu dữ liệu cho banner
interface Banner {
  id: number;
  title: string;
  image: string;
  link?: string;
  buttonText?: string;
  order: number;
  status: 'active' | 'inactive';
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerButtonText, setBannerButtonText] = useState('');
  const [bannerOrder, setBannerOrder] = useState(1);
  const [bannerStatus, setBannerStatus] = useState<'active' | 'inactive'>('active');

  // Tải dữ liệu banners từ localStorage khi component được mount
  useEffect(() => {
    const loadBanners = () => {
      try {
        const savedBanners = localStorage.getItem('banners');
        if (savedBanners) {
          setBanners(JSON.parse(savedBanners));
        } else {
          // Dữ liệu mẫu nếu không có dữ liệu trong localStorage
          const defaultBanners: Banner[] = [
            {
              id: 1,
              title: 'Khuyến mãi tháng 4',
              image: 'https://via.placeholder.com/1200x400/e60000/ffffff?text=Khuyến+mãi+tháng+4',
              link: '/promotions',
              buttonText: 'Xem ngay',
              order: 1,
              status: 'active'
            },
            {
              id: 2,
              title: 'Trò chơi mới',
              image: 'https://via.placeholder.com/1200x400/0066cc/ffffff?text=Trò+chơi+mới',
              link: '/games',
              buttonText: 'Chơi ngay',
              order: 2,
              status: 'active'
            },
            {
              id: 3,
              title: 'Thưởng nạp lần đầu',
              image: 'https://via.placeholder.com/1200x400/009933/ffffff?text=Thưởng+nạp+lần+đầu',
              link: '/bonus',
              buttonText: 'Nhận thưởng',
              order: 3,
              status: 'active'
            }
          ];
          setBanners(defaultBanners);
          localStorage.setItem('banners', JSON.stringify(defaultBanners));
        }
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  // Mở modal để thêm banner mới
  const handleAddBanner = () => {
    setCurrentBanner(null);
    setBannerTitle('');
    setBannerImage('');
    setBannerLink('');
    setBannerButtonText('');
    setBannerOrder(banners.length > 0 ? Math.max(...banners.map(banner => banner.order)) + 1 : 1);
    setBannerStatus('active');
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa banner
  const handleEditBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setBannerTitle(banner.title);
    setBannerImage(banner.image);
    setBannerLink(banner.link || '');
    setBannerButtonText(banner.buttonText || '');
    setBannerOrder(banner.order);
    setBannerStatus(banner.status);
    setIsModalOpen(true);
  };

  // Xóa banner
  const handleDeleteBanner = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      const updatedBanners = banners.filter(banner => banner.id !== id);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
    }
  };

  // Thay đổi trạng thái banner (hiển thị/ẩn)
  const handleToggleStatus = (id: number) => {
    const updatedBanners = banners.map(banner => {
      if (banner.id === id) {
        return {
          ...banner,
          status: banner.status === 'active' ? 'inactive' : 'active'
        };
      }
      return banner;
    });
    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
  };

  // Lưu banner (thêm mới hoặc cập nhật)
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();

    const bannerData: Banner = {
      id: currentBanner ? currentBanner.id : Date.now(),
      title: bannerTitle,
      image: bannerImage,
      link: bannerLink || undefined,
      buttonText: bannerButtonText || undefined,
      order: bannerOrder,
      status: bannerStatus
    };

    let updatedBanners: Banner[];

    if (currentBanner) {
      // Cập nhật banner hiện có
      updatedBanners = banners.map(banner => 
        banner.id === currentBanner.id ? bannerData : banner
      );
    } else {
      // Thêm banner mới
      updatedBanners = [...banners, bannerData];
    }

    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    setIsModalOpen(false);
  };

  // Xử lý khi tải ảnh lên
  const handleImageUpload = (imageUrl: string) => {
    setBannerImage(imageUrl);
  };

  if (isLoading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  return (
    <div className={styles.bannersPage}>
      <div className={styles.header}>
        <button className={styles.addButton} onClick={handleAddBanner}>
          <FaPlus /> Thêm banner mới
        </button>
      </div>

      {banners.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Chưa có banner nào. Nhấp vào nút "Thêm banner mới" để bắt đầu.</p>
        </div>
      ) : (
        <div className={styles.bannersList}>
          {banners
            .sort((a, b) => a.order - b.order)
            .map(banner => (
              <div key={banner.id} className={styles.bannerCard}>
                <div className={styles.bannerImageContainer}>
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className={styles.bannerImage} 
                  />
                  {banner.status === 'inactive' && (
                    <div className={styles.inactiveOverlay}>Ẩn</div>
                  )}
                </div>
                <div className={styles.bannerInfo}>
                  <h3 className={styles.bannerTitle}>{banner.title}</h3>
                  <div className={styles.bannerDetails}>
                    <p>Thứ tự: {banner.order}</p>
                    {banner.link && <p>Liên kết: {banner.link}</p>}
                    {banner.buttonText && <p>Nút: {banner.buttonText}</p>}
                  </div>
                </div>
                <div className={styles.bannerActions}>
                  <button 
                    className={styles.statusButton}
                    onClick={() => handleToggleStatus(banner.id)}
                    title={banner.status === 'active' ? 'Ẩn banner' : 'Hiển thị banner'}
                  >
                    {banner.status === 'active' ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEditBanner(banner)}
                  >
                    <FaEdit /> Sửa
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    <FaTrash /> Xóa
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{currentBanner ? 'Chỉnh sửa banner' : 'Thêm banner mới'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveBanner}>
              <div className={styles.formGroup}>
                <label htmlFor="bannerTitle">Tiêu đề</label>
                <input
                  type="text"
                  id="bannerTitle"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <ImageUploader
                  initialImage={bannerImage}
                  onImageUpload={handleImageUpload}
                  label="Hình ảnh banner"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bannerLink">Liên kết (tùy chọn)</label>
                <input
                  type="text"
                  id="bannerLink"
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  placeholder="Ví dụ: /promotions"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bannerButtonText">Văn bản nút (tùy chọn)</label>
                <input
                  type="text"
                  id="bannerButtonText"
                  value={bannerButtonText}
                  onChange={(e) => setBannerButtonText(e.target.value)}
                  placeholder="Ví dụ: Xem ngay"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bannerOrder">Thứ tự hiển thị</label>
                <input
                  type="number"
                  id="bannerOrder"
                  value={bannerOrder}
                  onChange={(e) => setBannerOrder(parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bannerStatus">Trạng thái</label>
                <select
                  id="bannerStatus"
                  value={bannerStatus}
                  onChange={(e) => setBannerStatus(e.target.value as 'active' | 'inactive')}
                >
                  <option value="active">Hiển thị</option>
                  <option value="inactive">Ẩn</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className={styles.saveButton}>
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
