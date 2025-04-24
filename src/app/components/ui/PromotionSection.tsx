'use client';

import { useState, useEffect } from 'react';
import styles from './PromotionSection.module.scss';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  endDate?: string;
}

const PromotionSection = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Dữ liệu mẫu mặc định
  const defaultPromotions: Promotion[] = [
    {
      id: 'promo-1',
      title: 'Thưởng chào mừng 100%',
      description: 'Nhận ngay 100% thưởng nạp lần đầu lên đến 5.000.000 VNĐ + 200 lượt quay miễn phí',
      image: 'https://via.placeholder.com/600x300/1a1a1a/ff0000?text=Welcome+Bonus',
      link: '#',
      active: true,
      endDate: '2023-12-31'
    },
    {
      id: 'promo-2',
      title: 'Hoàn tiền không giới hạn',
      description: 'Nhận lại 15% tiền thua của bạn mỗi tuần, không giới hạn số tiền hoàn trả',
      image: 'https://via.placeholder.com/600x300/1a1a1a/ffcc00?text=Weekly+Cashback',
      link: '#',
      active: true,
      endDate: ''
    },
    {
      id: 'promo-3',
      title: 'Đặc quyền VIP',
      description: 'Tận hưởng đặc quyền VIP với nhiều ưu đãi độc quyền và hỗ trợ khách hàng 24/7',
      image: 'https://via.placeholder.com/600x300/1a1a1a/00ff00?text=VIP+Program',
      link: '#',
      active: true,
      endDate: ''
    }
  ];

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lấy dữ liệu từ localStorage khi ở client-side
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedPromotions = JSON.parse(localStorage.getItem('sitePromotions') || '[]');

      if (storedPromotions.length > 0) {
        // Lọc các khuyến mãi đang active
        const activePromotions = storedPromotions.filter((promo: Promotion) => promo.active);
        
        // Kiểm tra ngày hết hạn
        const validPromotions = activePromotions.filter((promo: Promotion) => {
          if (!promo.endDate) return true;
          const endDate = new Date(promo.endDate);
          const today = new Date();
          return endDate >= today;
        });
        
        setPromotions(validPromotions);
      } else {
        // Nếu không có dữ liệu trong localStorage, sử dụng dữ liệu mẫu
        setPromotions(defaultPromotions);
        
        // Lưu dữ liệu mẫu vào localStorage
        localStorage.setItem('sitePromotions', JSON.stringify(defaultPromotions));
      }
    } catch (err) {
      console.error('Error loading promotions:', err);
      setPromotions(defaultPromotions);
    }
  }, [isClient]);

  // Xác định badge cho khuyến mãi
  const getPromotionBadge = (promotion: Promotion) => {
    if (promotion.endDate) {
      const endDate = new Date(promotion.endDate);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3) return 'SẮP HẾT HẠN';
      if (diffDays <= 7) return 'HOT';
    }
    
    return 'NEW';
  };

  // Hiển thị icon cho khuyến mãi
  const getPromotionIcon = (promotion: Promotion) => {
    if (promotion.title.toLowerCase().includes('thưởng') || 
        promotion.title.toLowerCase().includes('welcome')) {
      return '🎁';
    }
    
    if (promotion.title.toLowerCase().includes('hoàn tiền') || 
        promotion.title.toLowerCase().includes('cashback')) {
      return '💰';
    }
    
    if (promotion.title.toLowerCase().includes('vip')) {
      return '👑';
    }
    
    return '🔥';
  };

  return (
    <section className={styles.promotionsSection}>
      <h2 className="section-title">Khuyến mãi</h2>
      <p className={styles.sectionDescription}>
        Ưu đãi hấp dẫn dành cho thành viên 92LOTTERY
      </p>

      <div className={styles.promotionCards}>
        {promotions.slice(0, 3).map((promotion) => (
          <div key={promotion.id} className={styles.promotionCardNew}>
            <div className={styles.promotionImageNew}>
              <img src={promotion.image} alt={promotion.title} />
              <div className={styles.promotionOverlayNew}></div>
              <div className={styles.promotionBadgeNew}>{getPromotionBadge(promotion)}</div>
            </div>
            <div className={styles.promotionContentNew}>
              <div className={styles.promotionIconNew}>{getPromotionIcon(promotion)}</div>
              <h3>{promotion.title}</h3>
              <p>{promotion.description}</p>
              <a href={promotion.link} className="btn btn-primary">
                Nhận ngay <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {promotions.length > 3 && (
        <div className={styles.viewAllPromotions}>
          <a href="/promotions" className={styles.viewAllLink}>
            Xem tất cả khuyến mãi <span>→</span>
          </a>
        </div>
      )}
    </section>
  );
};

export default PromotionSection;
