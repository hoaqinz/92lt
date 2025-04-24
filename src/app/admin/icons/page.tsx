'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styles from './icons.module.scss';

interface Icon {
  id: string;
  image: string;
  link: string;
  title: string;
  active: boolean;
  category: string;
}

export default function IconsPage() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [newIcon, setNewIcon] = useState<Icon>({
    id: '',
    image: '',
    link: '',
    title: '',
    active: true,
    category: 'payment'
  });
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iconToDelete, setIconToDelete] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('lottery');

  // Dữ liệu mẫu mặc định
  const defaultIcons: Icon[] = [
    // Tab Xổ số
    {
      id: 'win-go',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff0000?text=Win+Go',
      link: '#',
      title: 'Win Go',
      active: true,
      category: 'lottery'
    },
    {
      id: 'k3-lotre',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff0000?text=K3+Lotre',
      link: '#',
      title: 'K3 Lotre',
      active: true,
      category: 'lottery'
    },
    {
      id: '5d-lotre',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff0000?text=5D+Lotre',
      link: '#',
      title: '5D Lotre',
      active: true,
      category: 'lottery'
    },

    // Tab Slots
    {
      id: 'pg-game',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=PG+Game',
      link: '#',
      title: 'PG Game',
      active: true,
      category: 'slots'
    },
    {
      id: 'jili-game',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=JILI+Game',
      link: '#',
      title: 'JILI Game',
      active: true,
      category: 'slots'
    },
    {
      id: 'jdb-game',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=JDB+Game',
      link: '#',
      title: 'JDB Game',
      active: true,
      category: 'slots'
    },
    {
      id: 'cq9-game',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=CQ9+Game',
      link: '#',
      title: 'CQ9 Game',
      active: true,
      category: 'slots'
    },

    // Tab Thể thao
    {
      id: 'saba-sports',
      image: 'https://via.placeholder.com/300x300/1a1a1a/00ff00?text=Saba+Sports',
      link: '#',
      title: 'Saba Thể Thao',
      active: true,
      category: 'sports'
    },
    {
      id: 'cmd-sports',
      image: 'https://via.placeholder.com/300x300/1a1a1a/00ff00?text=CMD+Sports',
      link: '#',
      title: 'CMD Thể Thao',
      active: true,
      category: 'sports'
    },

    // Tab Casino
    {
      id: 'dg-casino',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=DG+Casino',
      link: '#',
      title: 'DG Casino Dream Gaming',
      active: true,
      category: 'casino'
    },
    {
      id: 'wm-casino',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=WM+Casino',
      link: '#',
      title: 'WM Casino',
      active: true,
      category: 'casino'
    },

    // Tab Game bài
    {
      id: 'v8-poker',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff00ff?text=V8+Poker',
      link: '#',
      title: 'V8 Poker',
      active: true,
      category: 'card-games'
    },
    {
      id: '365-games',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff00ff?text=365+Games',
      link: '#',
      title: '365 Games',
      active: true,
      category: 'card-games'
    },
    // Phương thức thanh toán
    {
      id: 'icon-1',
      image: 'https://via.placeholder.com/100x60/1a1a1a/ff0000?text=VISA',
      link: '#',
      title: 'VISA',
      active: true,
      category: 'payment'
    },
    {
      id: 'icon-2',
      image: 'https://via.placeholder.com/100x60/1a1a1a/ffcc00?text=MasterCard',
      link: '#',
      title: 'MasterCard',
      active: true,
      category: 'payment'
    },
    {
      id: 'icon-3',
      image: 'https://via.placeholder.com/100x60/1a1a1a/00ff00?text=Momo',
      link: '#',
      title: 'Momo',
      active: true,
      category: 'payment'
    },
    {
      id: 'icon-4',
      image: 'https://via.placeholder.com/100x60/1a1a1a/00ccff?text=ZaloPay',
      link: '#',
      title: 'ZaloPay',
      active: true,
      category: 'payment'
    },
    // Nhà cung cấp
    {
      id: 'icon-5',
      image: 'https://via.placeholder.com/100x60/1a1a1a/ff0000?text=PG+Soft',
      link: '#',
      title: 'PG Soft',
      active: true,
      category: 'provider'
    },
    {
      id: 'icon-6',
      image: 'https://via.placeholder.com/100x60/1a1a1a/ffcc00?text=Pragmatic',
      link: '#',
      title: 'Pragmatic Play',
      active: true,
      category: 'provider'
    },
    {
      id: 'icon-7',
      image: 'https://via.placeholder.com/100x60/1a1a1a/00ff00?text=Evolution',
      link: '#',
      title: 'Evolution Gaming',
      active: true,
      category: 'provider'
    },
    // Mạng xã hội
    {
      id: 'icon-8',
      image: 'https://via.placeholder.com/100x60/1a1a1a/ff0000?text=Facebook',
      link: '#',
      title: 'Facebook',
      active: true,
      category: 'social'
    },
    {
      id: 'icon-9',
      image: 'https://via.placeholder.com/100x60/1a1a1a/00ccff?text=Telegram',
      link: '#',
      title: 'Telegram',
      active: true,
      category: 'social'
    }
  ];

  // Danh sách danh mục
  const categories = [
    { id: 'lottery', name: 'Xổ số' },
    { id: 'slots', name: 'Slots' },
    { id: 'sports', name: 'Thể thao' },
    { id: 'casino', name: 'Casino' },
    { id: 'card-games', name: 'Game bài' },
    { id: 'fishing', name: 'Bắn cá' },
    { id: 'mini-games', name: 'Mini game' },
    { id: 'popular', name: 'Phổ biến' },
    { id: 'payment', name: 'Phương thức thanh toán' },
    { id: 'provider', name: 'Nhà cung cấp' },
    { id: 'social', name: 'Mạng xã hội' },
    { id: 'partner', name: 'Đối tác' },
    { id: 'other', name: 'Khác' }
  ];

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
    setIcons(defaultIcons); // Khởi tạo với dữ liệu mẫu
    setLoading(false);
  }, []);

  // Lấy dữ liệu từ localStorage khi ở client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedIcons = JSON.parse(localStorage.getItem('siteIcons') || '[]');

      if (storedIcons.length > 0) {
        // Nếu có dữ liệu trong localStorage, sử dụng nó
        setIcons(storedIcons);
      } else {
        // Nếu không có dữ liệu trong localStorage, lưu dữ liệu mẫu
        localStorage.setItem('siteIcons', JSON.stringify(defaultIcons));
      }
    } catch (err) {
      console.error('Error loading icons:', err);
      setError('Đã xảy ra lỗi khi tải danh sách icon');
    }
  }, [isClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setNewIcon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddIcon = () => {
    if (!newIcon.image || !newIcon.title) {
      setError('Vui lòng nhập URL hình ảnh và tiêu đề icon');
      return;
    }

    if (!isClient) {
      setError('Không thể thêm icon ở chế độ server-side');
      return;
    }

    try {
      const newIconWithId = {
        ...newIcon,
        id: `icon-${Date.now()}`
      };

      const updatedIcons = [...icons, newIconWithId];
      setIcons(updatedIcons);

      // Lưu vào localStorage
      localStorage.setItem('siteIcons', JSON.stringify(updatedIcons));

      // Reset form
      setNewIcon({
        id: '',
        image: '',
        link: '',
        title: '',
        active: true,
        category: activeCategory
      });

      setSuccess('Thêm icon mới thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding icon:', err);
      setError('Đã xảy ra lỗi khi thêm icon');
    }
  };

  const handleDeleteClick = (iconId: string) => {
    setIconToDelete(iconId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (iconToDelete && isClient) {
      try {
        const updatedIcons = icons.filter(icon => icon.id !== iconToDelete);
        setIcons(updatedIcons);

        // Lưu vào localStorage
        localStorage.setItem('siteIcons', JSON.stringify(updatedIcons));

        setShowDeleteModal(false);
        setIconToDelete(null);
        setSuccess('Xóa icon thành công!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting icon:', err);
        setError('Đã xảy ra lỗi khi xóa icon');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIconToDelete(null);
  };

  const handleToggleActive = (iconId: string) => {
    if (!isClient) return;

    try {
      const updatedIcons = icons.map(icon => {
        if (icon.id === iconId) {
          return { ...icon, active: !icon.active };
        }
        return icon;
      });

      setIcons(updatedIcons);

      // Lưu vào localStorage
      localStorage.setItem('siteIcons', JSON.stringify(updatedIcons));
    } catch (err) {
      console.error('Error toggling icon status:', err);
      setError('Đã xảy ra lỗi khi cập nhật trạng thái icon');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !isClient) return;

    try {
      // Lọc các icon cùng danh mục
      const categoryIcons = icons.filter(icon => icon.category === activeCategory);
      const categoryIndex = categoryIcons.findIndex(icon => icon.id === icons[index].id);

      if (categoryIndex <= 0) return;

      // Tìm vị trí thực tế của icon trước đó trong mảng gốc
      const prevIconId = categoryIcons[categoryIndex - 1].id;
      const prevIndex = icons.findIndex(icon => icon.id === prevIconId);

      // Hoán đổi vị trí
      const updatedIcons = [...icons];
      [updatedIcons[index], updatedIcons[prevIndex]] = [updatedIcons[prevIndex], updatedIcons[index]];

      setIcons(updatedIcons);

      // Lưu vào localStorage
      localStorage.setItem('siteIcons', JSON.stringify(updatedIcons));
    } catch (err) {
      console.error('Error moving icon:', err);
      setError('Đã xảy ra lỗi khi di chuyển icon');
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === icons.length - 1 || !isClient) return;

    try {
      // Lọc các icon cùng danh mục
      const categoryIcons = icons.filter(icon => icon.category === activeCategory);
      const categoryIndex = categoryIcons.findIndex(icon => icon.id === icons[index].id);

      if (categoryIndex >= categoryIcons.length - 1) return;

      // Tìm vị trí thực tế của icon tiếp theo trong mảng gốc
      const nextIconId = categoryIcons[categoryIndex + 1].id;
      const nextIndex = icons.findIndex(icon => icon.id === nextIconId);

      // Hoán đổi vị trí
      const updatedIcons = [...icons];
      [updatedIcons[index], updatedIcons[nextIndex]] = [updatedIcons[nextIndex], updatedIcons[index]];

      setIcons(updatedIcons);

      // Lưu vào localStorage
      localStorage.setItem('siteIcons', JSON.stringify(updatedIcons));
    } catch (err) {
      console.error('Error moving icon:', err);
      setError('Đã xảy ra lỗi khi di chuyển icon');
    }
  };

  // Lọc icon theo danh mục đang chọn
  const filteredIcons = icons.filter(icon => icon.category === activeCategory);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.iconsContainer}>
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

      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => {
              setActiveCategory(category.id);
              setNewIcon(prev => ({ ...prev, category: category.id }));
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <h3>Thêm icon mới - {categories.find(c => c.id === activeCategory)?.name}</h3>
        <div className="admin-form">
          <div className="form-group">
            <label htmlFor="image">URL hình ảnh *</label>
            <input
              type="text"
              id="image"
              name="image"
              value={newIcon.image}
              onChange={handleInputChange}
              placeholder="Nhập URL hình ảnh icon"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newIcon.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề icon"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Liên kết</label>
            <input
              type="text"
              id="link"
              name="link"
              value={newIcon.link}
              onChange={handleInputChange}
              placeholder="Nhập liên kết khi click vào icon"
            />
          </div>

          <div className="form-group">
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="active"
                checked={newIcon.active}
                onChange={handleInputChange}
              />
              Hiển thị icon
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="admin-btn primary"
              onClick={handleAddIcon}
            >
              <FaPlus /> Thêm icon
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Danh sách icon - {categories.find(c => c.id === activeCategory)?.name}</h3>
        {filteredIcons.length === 0 ? (
          <div className="admin-alert info">
            <p>Chưa có icon nào trong danh mục này. Hãy thêm icon mới!</p>
          </div>
        ) : (
          <div className={styles.iconsList}>
            {filteredIcons.map((icon, index) => (
              <div key={icon.id} className={styles.iconItem}>
                <div className={styles.iconPreview}>
                  <img src={icon.image} alt={icon.title} />
                  <div className={styles.iconOverlay}>
                    <h4>{icon.title}</h4>
                    <p>Link: {icon.link || '#'}</p>
                    <p>Trạng thái: {icon.active ? 'Hiển thị' : 'Ẩn'}</p>
                  </div>
                </div>
                <div className={styles.iconActions}>
                  <button
                    className={`${styles.actionButton} ${styles.toggleButton} ${icon.active ? styles.active : styles.inactive}`}
                    onClick={() => handleToggleActive(icon.id)}
                    title={icon.active ? 'Ẩn icon' : 'Hiển thị icon'}
                  >
                    {icon.active ? 'Hiển thị' : 'Ẩn'}
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
                    disabled={index === filteredIcons.length - 1}
                    title="Di chuyển xuống"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteClick(icon.id)}
                    title="Xóa icon"
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
            <p>Bạn có chắc chắn muốn xóa icon này không? Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
              <button className="admin-btn secondary" onClick={cancelDelete}>
                Hủy bỏ
              </button>
              <button className="admin-btn danger" onClick={confirmDelete}>
                Xóa icon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
