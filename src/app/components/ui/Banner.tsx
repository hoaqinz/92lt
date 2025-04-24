'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Banner.module.scss';

interface BannerItem {
  id: string;
  image: string;
  link: string;
  title: string;
  active: boolean;
}

interface BannerProps {
  banners?: {
    title: string;
    description: string;
    buttonText: string;
    image: string;
  }[];
}

const Banner = ({ banners: propBanners }: BannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Khởi tạo với dữ liệu mặc định từ props
  const defaultBanners = propBanners ? propBanners.map((banner, index) => ({
    id: `default-banner-${index}`,
    image: banner.image,
    link: '#',
    title: banner.title,
    active: true
  })) : [];

  const [banners, setBanners] = useState<BannerItem[]>(defaultBanners);
  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lấy dữ liệu banner từ localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedBanners = JSON.parse(localStorage.getItem('siteBanners') || '[]');

      // Lọc các banner đang active
      const activeBanners = storedBanners.filter((banner: BannerItem) => banner.active);

      if (activeBanners.length > 0) {
        setBanners(activeBanners);
      }
    } catch (err) {
      console.error('Error loading banners from localStorage:', err);
      // Giữ nguyên dữ liệu mặc định nếu có lỗi
    }
  }, [isClient]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Nếu không có banner nào, không hiển thị gì cả
  if (banners.length === 0) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.bannerSlider}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.bannerSlide} ${index === currentSlide ? styles.active : ''}`}
          >
            {/* Sử dụng thẻ a bao quanh toàn bộ banner nếu có link */}
            {banner.link ? (
              <a
                href={banner.link}
                className={`${styles.bannerLink} ${banner.title ? styles.hasTitle : ''}`}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {/* Nội dung banner chỉ hiển thị nếu có title */}
                {banner.title && (
                  <div className="container">
                    <div className={styles.bannerContent}>
                      <h2>
                        <span>{banner.title.split(' ')[0]}</span> {banner.title.split(' ').slice(1).join(' ')}
                      </h2>
                    </div>
                  </div>
                )}
              </a>
            ) : (
              // Nếu không có link, chỉ hiển thị hình ảnh
              <div
                className={`${styles.bannerImage} ${banner.title ? styles.hasTitle : ''}`}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                {/* Nội dung banner chỉ hiển thị nếu có title */}
                {banner.title && (
                  <div className="container">
                    <div className={styles.bannerContent}>
                      <h2>
                        <span>{banner.title.split(' ')[0]}</span> {banner.title.split(' ').slice(1).join(' ')}
                      </h2>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button className={`${styles.bannerNav} ${styles.prev}`} onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className={`${styles.bannerNav} ${styles.next}`} onClick={nextSlide}>
            <FaChevronRight />
          </button>

          <div className={styles.bannerDots}>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`${styles.bannerDot} ${index === currentSlide ? styles.active : ''}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Banner;
