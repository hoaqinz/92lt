'use client';

import { useState } from 'react';
import Banner from './components/ui/Banner';
import TabContent from './components/ui/TabContent';
import PromotionSection from './components/ui/PromotionSection';
import BlogSection from './components/ui/BlogSection';
import styles from './page.module.scss';

// Mock data for banners
const bannerData = [
  {
    title: 'Chào mừng đến 92LOTTERY',
    description: 'Đăng ký ngay và nhận 100% tiền thưởng lên đến 500$ + 200 lượt quay miễn phí',
    buttonText: 'Nhận thưởng',
    image: 'https://via.placeholder.com/1920x500/1a1a1a/ff0000?text=92LOTTERY+Welcome+Bonus',
  },
  {
    title: 'Cược thể thao',
    description: 'Đặt cược với tỷ lệ tốt nhất và nhận cược miễn phí lên đến 50$',
    buttonText: 'Đặt cược ngay',
    image: 'https://via.placeholder.com/1920x500/1a1a1a/ffcc00?text=92LOTTERY+Sports+Betting',
  },
  {
    title: 'Casino trực tuyến',
    description: 'Trải nghiệm cảm giác hấp dẫn với các trò chơi casino thật với dealer chuyên nghiệp',
    buttonText: 'Chơi ngay',
    image: 'https://via.placeholder.com/1920x500/1a1a1a/00ff00?text=92LOTTERY+Live+Casino',
  },
];



export default function Home() {
  const [activeTab, setActiveTab] = useState('lottery');

  const tabs = [
    { id: 'lottery', name: 'Xổ số', description: 'Trải nghiệm các trò chơi xổ số hấp dẫn với cơ hội trúng thưởng lớn.' },
    { id: 'slots', name: 'Slots', description: 'Khám phá thế giới slots đa dạng từ các nhà cung cấp game hàng đầu.' },
    { id: 'sports', name: 'Thể thao', description: 'Đặt cược vào các sự kiện thể thao với tỷ lệ cược hấp dẫn nhất.' },
    { id: 'casino', name: 'Casino', description: 'Trải nghiệm không khí casino thực tế với các trò chơi đẳng cấp.' },
    { id: 'card-games', name: 'Game bài', description: 'Thử vận may với các trò chơi bài phổ biến và hấp dẫn.' },
    { id: 'fishing', name: 'Bắn cá', description: 'Tham gia săn cá và nhận thưởng lớn với các trò chơi bắn cá hấp dẫn.' },
    { id: 'mini-games', name: 'Mini game', description: 'Giải trí với các mini game đơn giản nhưng không kém phần thú vị.' },
    { id: 'popular', name: 'Phổ biến', description: 'Những trò chơi được yêu thích nhất tại 92LOTTERY.' }
  ];

  return (
    <div className={styles.homePage}>
      <Banner banners={bannerData} />

      <div className="container">
        <section className={styles.gamesSection}>
          <div className={styles.tabsContainer}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            <h2 className="section-title">{tabs.find(tab => tab.id === activeTab)?.name}</h2>
            <p className={styles.sectionDescription}>
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
            <TabContent activeTab={activeTab} />
          </div>
        </section>

        <PromotionSection />

        <section className={styles.blogSection}>
          <BlogSection />
        </section>

        <section className={styles.aboutSection}>
          <h2 className="section-title">Về 92LOTTERY</h2>
          <div className={styles.aboutContent}>
            <p>92LOTTERY là nền tảng casino trực tuyến và cược thể thao hàng đầu cung cấp nhiều loại trò chơi và lựa chọn cược đa dạng. Với giao diện thân thiện, phương thức thanh toán an toàn và hỗ trợ khách hàng 24/7, 92LOTTERY mang đến trải nghiệm chơi game tuyệt vời cho người chơi trên toàn thế giới.</p>
            <p>Nền tảng của chúng tôi có hàng trăm trò chơi casino từ các nhà cung cấp hàng đầu, tỷ lệ cạnh tranh cho cược thể thao và nhiều khuyến mãi hấp dẫn. Tham gia 92LOTTERY ngay hôm nay và trải nghiệm cảm giác hấp dẫn của trò chơi trực tuyến ở mức tốt nhất.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
