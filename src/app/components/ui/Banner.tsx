'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Banner.module.scss';

// Định nghĩa kiểu dữ liệu cho banner từ admin
interface AdminBanner {
  id: number;
  title: string;
  image: string;
  link?: string;
  buttonText?: string;
  order: number;
  status: 'active' | 'inactive';
}

// Định nghĩa kiểu dữ liệu cho banner trong component
interface BannerItem {
  id: string | number;
  image: string;
  link?: string;
  title: string;
  buttonText?: string;
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
    buttonText: banner.buttonText,
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
      // Lấy dữ liệu từ localStorage - sử dụng key 'banners' từ admin
      const storedBannersString = localStorage.getItem('banners');
      
      if (storedBannersString) {
        console.log('Loaded banners from localStorage:', storedBannersString);
        
        const storedBanners = JSON.parse(storedBannersString) as AdminBanner[];
        
        // Chuyển đổi từ định dạng admin sang định dạng component
        const convertedBanners: BannerItem[] = storedBanners
          .filter(banner => banner.status === 'active')
          .map(banner => ({
            id: banner.id,
            image: banner.image,
            link: banner.link,
            title: banner.title,
            buttonText: banner.buttonText,
            active: true
          }))
          .sort((a, b) => {
            // Sắp xếp theo thứ tự của banner gốc
            const aIndex = storedBanners.findIndex(banner => banner.id === a.id);
            const bIndex = storedBanners.findIndex(banner => banner.id === b.id);
            return aIndex - bIndex;
          });

        if (convertedBanners.length > 0) {
          console.log('Using banners from admin:', convertedBanners);
          setBanners(convertedBanners);
        } else if (defaultBanners.length > 0) {
          console.log('No active banners found, using default banners');
          setBanners(defaultBanners);
        }
      } else if (defaultBanners.length > 0) {
        console.log('No banners in localStorage, using default banners');
        setBanners(defaultBanners);
      }
    } catch (err) {
      console.error('Error loading banners from localStorage:', err);
      // Giữ nguyên dữ liệu mặc định nếu có lỗi
      if (defaultBanners.length > 0) {
        setBanners(defaultBanners);
      }
    }
  }, [isClient, defaultBanners]);

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
  }, [currentSlide, banners.length]);

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
                      {banner.buttonText && (
                        <button className={styles.bannerButton}>{banner.buttonText}</button>
                      )}
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
                      {banner.buttonText && (
                        <button className={styles.bannerButton}>{banner.buttonText}</button>
                      )}
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
