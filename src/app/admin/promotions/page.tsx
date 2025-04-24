'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaEdit, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styles from './promotions.module.scss';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  endDate?: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromotion, setNewPromotion] = useState<Promotion>({
    id: '',
    title: '',
    description: '',
    image: '',
    link: '',
    active: true,
    endDate: ''
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Dữ liệu mẫu mặc định
  const defaultPromotions: Promotion[] = [
    {
      id: 'promo-1',
      title: 'Thưởng chào mừng 100%',
      description: 'Nhận ngay 100% tiền thưởng cho lần nạp đầu tiên lên đến 2,000,000 VND',
      image: 'https://via.placeholder.com/600x300/1a1a1a/ff0000?text=Welcome+Bonus',
      link: '#',
      active: true,
      endDate: '2023-12-31'
    },
    {
      id: 'promo-2',
      title: 'Hoàn trả hàng ngày 1.0%',
      description: 'Nhận hoàn trả hàng ngày 1.0% cho tất cả các trò chơi không giới hạn',
      image: 'https://via.placeholder.com/600x300/1a1a1a/ffcc00?text=Daily+Cashback',
      link: '#',
      active: true,
      endDate: ''
    },
    {
      id: 'promo-3',
      title: 'Thưởng nạp lại 50%',
      description: 'Nhận thưởng 50% cho mỗi lần nạp lại, lên đến 1,000,000 VND mỗi ngày',
      image: 'https://via.placeholder.com/600x300/1a1a1a/00ff00?text=Reload+Bonus',
      link: '#',
      active: true,
      endDate: '2023-11-30'
    }
  ];

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
    setPromotions(defaultPromotions); // Khởi tạo với dữ liệu mẫu
    setLoading(false);
  }, []);

  // Lấy dữ liệu từ localStorage khi ở client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedPromotions = JSON.parse(localStorage.getItem('sitePromotions') || '[]');

      if (storedPromotions.length > 0) {
        // Nếu có dữ liệu trong localStorage, sử dụng nó
        setPromotions(storedPromotions);
      } else {
        // Nếu không có dữ liệu trong localStorage, lưu dữ liệu mẫu
        localStorage.setItem('sitePromotions', JSON.stringify(defaultPromotions));
      }
    } catch (err) {
      console.error('Error loading promotions:', err);
      setError('Đã xảy ra lỗi khi tải danh sách khuyến mãi');
    }
  }, [isClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setNewPromotion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPromotion = () => {
    if (!newPromotion.title || !newPromotion.image) {
      setError('Vui lòng nhập tiêu đề và URL hình ảnh khuyến mãi');
      return;
    }

    if (!isClient) {
      setError('Không thể thêm khuyến mãi ở chế độ server-side');
      return;
    }

    try {
      let updatedPromotions;
      
      if (editMode) {
        // Cập nhật khuyến mãi hiện có
        updatedPromotions = promotions.map(promo => 
          promo.id === newPromotion.id ? newPromotion : promo
        );
        setSuccess('Cập nhật khuyến mãi thành công!');
      } else {
        // Thêm khuyến mãi mới
        const newPromotionWithId = {
          ...newPromotion,
          id: `promo-${Date.now()}`
        };
        updatedPromotions = [...promotions, newPromotionWithId];
        setSuccess('Thêm khuyến mãi mới thành công!');
      }

      setPromotions(updatedPromotions);

      // Lưu vào localStorage
      localStorage.setItem('sitePromotions', JSON.stringify(updatedPromotions));

      // Reset form
      setNewPromotion({
        id: '',
        title: '',
        description: '',
        image: '',
        link: '',
        active: true,
        endDate: ''
      });
      
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding/updating promotion:', err);
      setError('Đã xảy ra lỗi khi thêm/cập nhật khuyến mãi');
    }
  };

  const handleEditClick = (promotion: Promotion) => {
    setNewPromotion(promotion);
    setEditMode(true);
  };

  const handleDeleteClick = (promotionId: string) => {
    setPromotionToDelete(promotionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (promotionToDelete && isClient) {
      try {
        const updatedPromotions = promotions.filter(promo => promo.id !== promotionToDelete);
        setPromotions(updatedPromotions);

        // Lưu vào localStorage
        localStorage.setItem('sitePromotions', JSON.stringify(updatedPromotions));

        setShowDeleteModal(false);
        setPromotionToDelete(null);
        setSuccess('Xóa khuyến mãi thành công!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting promotion:', err);
        setError('Đã xảy ra lỗi khi xóa khuyến mãi');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPromotionToDelete(null);
  };

  const handleToggleActive = (promotionId: string) => {
    if (!isClient) return;

    try {
      const updatedPromotions = promotions.map(promo => {
        if (promo.id === promotionId) {
          return { ...promo, active: !promo.active };
        }
        return promo;
      });

      setPromotions(updatedPromotions);

      // Lưu vào localStorage
      localStorage.setItem('sitePromotions', JSON.stringify(updatedPromotions));
    } catch (err) {
      console.error('Error toggling promotion status:', err);
      setError('Đã xảy ra lỗi khi cập nhật trạng thái khuyến mãi');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !isClient) return;

    try {
      const updatedPromotions = [...promotions];
      [updatedPromotions[index], updatedPromotions[index - 1]] = [updatedPromotions[index - 1], updatedPromotions[index]];
      
      setPromotions(updatedPromotions);

      // Lưu vào localStorage
      localStorage.setItem('sitePromotions', JSON.stringify(updatedPromotions));
    } catch (err) {
      console.error('Error moving promotion:', err);
      setError('Đã xảy ra lỗi khi di chuyển khuyến mãi');
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === promotions.length - 1 || !isClient) return;

    try {
      const updatedPromotions = [...promotions];
      [updatedPromotions[index], updatedPromotions[index + 1]] = [updatedPromotions[index + 1], updatedPromotions[index]];
      
      setPromotions(updatedPromotions);

      // Lưu vào localStorage
      localStorage.setItem('sitePromotions', JSON.stringify(updatedPromotions));
    } catch (err) {
      console.error('Error moving promotion:', err);
      setError('Đã xảy ra lỗi khi di chuyển khuyến mãi');
    }
  };

  const handleCancelEdit = () => {
    setNewPromotion({
      id: '',
      title: '',
      description: '',
      image: '',
      link: '',
      active: true,
      endDate: ''
    });
    setEditMode(false);
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
    <div className={styles.promotionsContainer}>
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
        <h3>{editMode ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}</h3>
        <div className="admin-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPromotion.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề khuyến mãi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={newPromotion.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả khuyến mãi"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL hình ảnh *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={newPromotion.image}
              onChange={handleInputChange}
              placeholder="Nhập URL hình ảnh khuyến mãi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Liên kết</label>
            <input
              type="text"
              id="link"
              name="link"
              value={newPromotion.link}
              onChange={handleInputChange}
              placeholder="Nhập liên kết khi click vào khuyến mãi"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Ngày kết thúc (tùy chọn)</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newPromotion.endDate}
              onChange={handleInputChange}
              placeholder="Chọn ngày kết thúc khuyến mãi"
            />
          </div>

          <div className="form-group">
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="active"
                checked={newPromotion.active}
                onChange={handleInputChange}
              />
              Hiển thị khuyến mãi
            </label>
          </div>

          <div className="form-actions">
            {editMode && (
              <button
                type="button"
                className="admin-btn secondary"
                onClick={handleCancelEdit}
              >
                Hủy chỉnh sửa
              </button>
            )}
            <button
              type="button"
              className="admin-btn primary"
              onClick={handleAddPromotion}
            >
              {editMode ? <><FaSave /> Cập nhật khuyến mãi</> : <><FaPlus /> Thêm khuyến mãi</>}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Danh sách khuyến mãi</h3>
        {promotions.length === 0 ? (
          <div className="admin-alert info">
            <p>Chưa có khuyến mãi nào. Hãy thêm khuyến mãi mới!</p>
          </div>
        ) : (
          <div className={styles.promotionsList}>
            {promotions.map((promotion, index) => (
              <div key={promotion.id} className={styles.promotionItem}>
                <div className={styles.promotionPreview}>
                  <img src={promotion.image} alt={promotion.title} />
                  <div className={styles.promotionOverlay}>
                    <h4>{promotion.title}</h4>
                    <p>{promotion.description}</p>
                    {promotion.endDate && (
                      <p className={styles.endDate}>Kết thúc: {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</p>
                    )}
                    <p>Trạng thái: {promotion.active ? 'Hiển thị' : 'Ẩn'}</p>
                  </div>
                </div>
                <div className={styles.promotionActions}>
                  <button
                    className={`${styles.actionButton} ${styles.toggleButton} ${promotion.active ? styles.active : styles.inactive}`}
                    onClick={() => handleToggleActive(promotion.id)}
                    title={promotion.active ? 'Ẩn khuyến mãi' : 'Hiển thị khuyến mãi'}
                  >
                    {promotion.active ? 'Hiển thị' : 'Ẩn'}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditClick(promotion)}
                    title="Chỉnh sửa khuyến mãi"
                  >
                    <FaEdit />
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
                    disabled={index === promotions.length - 1}
                    title="Di chuyển xuống"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteClick(promotion.id)}
                    title="Xóa khuyến mãi"
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
            <p>Bạn có chắc chắn muốn xóa khuyến mãi này không? Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
              <button className="admin-btn secondary" onClick={cancelDelete}>
                Hủy bỏ
              </button>
              <button className="admin-btn danger" onClick={confirmDelete}>
                Xóa khuyến mãi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
