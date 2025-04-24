'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './GameIcons.module.scss';

interface GameIcon {
  id: string;
  image: string;
  link: string;
  title: string;
  active: boolean;
  category: string;
}

export default function GameIcons() {
  const [gameIcons, setGameIcons] = useState<GameIcon[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lấy dữ liệu icon từ localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedIcons = JSON.parse(localStorage.getItem('siteIcons') || '[]');
      
      // Lọc các icon thuộc danh mục game và đang active
      const activeGameIcons = storedIcons.filter((icon: GameIcon) => 
        icon.category === 'game' && icon.active
      );
      
      if (activeGameIcons.length > 0) {
        setGameIcons(activeGameIcons);
      } else {
        // Dữ liệu mẫu mặc định nếu không có dữ liệu trong localStorage
        const defaultIcons = [
          {
            id: 'icon-game-1',
            image: 'https://via.placeholder.com/100x100/1a1a1a/ff0000?text=WinGo',
            link: '#',
            title: 'WinGo',
            active: true,
            category: 'game'
          },
          {
            id: 'icon-game-2',
            image: 'https://via.placeholder.com/100x100/1a1a1a/ffcc00?text=K3+Lotre',
            link: '#',
            title: 'K3 Lotre',
            active: true,
            category: 'game'
          },
          {
            id: 'icon-game-3',
            image: 'https://via.placeholder.com/100x100/1a1a1a/00ff00?text=5D+Lotre',
            link: '#',
            title: '5D Lotre',
            active: true,
            category: 'game'
          }
        ];
        setGameIcons(defaultIcons);
      }
    } catch (err) {
      console.error('Error loading game icons from localStorage:', err);
    }
  }, [isClient]);

  if (gameIcons.length === 0) {
    return null;
  }

  return (
    <div className={styles.gameIconsContainer}>
      <div className="container">
        <div className={styles.gameIconsGrid}>
          {gameIcons.map(icon => (
            <Link href={icon.link} key={icon.id} className={styles.gameIconItem}>
              <div className={styles.gameIconImage}>
                <img src={icon.image} alt={icon.title} />
              </div>
              <div className={styles.gameIconTitle}>{icon.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
