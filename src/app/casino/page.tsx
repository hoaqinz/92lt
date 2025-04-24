'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './casino.module.scss';

// Mock data for game categories
const categories = [
  { id: 'all', name: 'Tất cả trò chơi', icon: <FaFire /> },
  { id: 'new', name: 'Trò chơi mới', icon: <FaStar /> },
  { id: 'slots', name: 'Slots', icon: <FaGamepad /> },
  { id: 'jackpot', name: 'Jackpots', icon: <FaTrophy /> },
];

// Mock data for games
const gamesData: Record<string, any[]> = {
  all: [
    {
      title: 'Book of Dead',
      provider: 'Play\'n GO',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ff0000?text=Book+of+Dead',
      isNew: false,
      isHot: true,
      isFavorite: true,
    },
    {
      title: 'Starburst',
      provider: 'NetEnt',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ffcc00?text=Starburst',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Gonzo\'s Quest',
      provider: 'NetEnt',
      image: 'https://via.placeholder.com/300x200/1a1a1a/00ff00?text=Gonzo\'s+Quest',
      isNew: false,
      isHot: false,
      isFavorite: true,
    },
    {
      title: 'Sweet Bonanza',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/0000ff?text=Sweet+Bonanza',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Wolf Gold',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ff00ff?text=Wolf+Gold',
      isNew: false,
      isHot: false,
      isFavorite: false,
    },
    {
      title: 'Big Bass Bonanza',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/00ffff?text=Big+Bass+Bonanza',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Gates of Olympus',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ff0000?text=Gates+of+Olympus',
      isNew: true,
      isHot: false,
      isFavorite: false,
    },
    {
      title: 'Money Train 3',
      provider: 'Relax Gaming',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ffcc00?text=Money+Train+3',
      isNew: true,
      isHot: true,
      isFavorite: false,
    },
  ],
  new: [
    {
      title: 'Gates of Olympus',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ff0000?text=Gates+of+Olympus',
      isNew: true,
      isHot: false,
      isFavorite: false,
    },
    {
      title: 'Money Train 3',
      provider: 'Relax Gaming',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ffcc00?text=Money+Train+3',
      isNew: true,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Sugar Rush',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/00ff00?text=Sugar+Rush',
      isNew: true,
      isHot: false,
      isFavorite: false,
    },
    {
      title: 'Wild West Gold Megaways',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/0000ff?text=Wild+West+Gold',
      isNew: true,
      isHot: false,
      isFavorite: false,
    },
  ],
  slots: [
    {
      title: 'Book of Dead',
      provider: 'Play\'n GO',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ff0000?text=Book+of+Dead',
      isNew: false,
      isHot: true,
      isFavorite: true,
    },
    {
      title: 'Starburst',
      provider: 'NetEnt',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ffcc00?text=Starburst',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Gonzo\'s Quest',
      provider: 'NetEnt',
      image: 'https://via.placeholder.com/300x200/1a1a1a/00ff00?text=Gonzo\'s+Quest',
      isNew: false,
      isHot: false,
      isFavorite: true,
    },
    {
      title: 'Sweet Bonanza',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x200/1a1a1a/0000ff?text=Sweet+Bonanza',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
  ],
  jackpot: [
    {
      title: 'Mega Moolah',
      provider: 'Microgaming',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ff0000?text=Mega+Moolah',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Divine Fortune',
      provider: 'NetEnt',
      image: 'https://via.placeholder.com/300x200/1a1a1a/ffcc00?text=Divine+Fortune',
      isNew: false,
      isHot: false,
      isFavorite: true,
    },
    {
      title: 'Wheel of Wishes',
      provider: 'Microgaming',
      image: 'https://via.placeholder.com/300x200/1a1a1a/00ff00?text=Wheel+of+Wishes',
      isNew: false,
      isHot: true,
      isFavorite: false,
    },
    {
      title: 'Jackpot Giant',
      provider: 'Playtech',
      image: 'https://via.placeholder.com/300x200/1a1a1a/0000ff?text=Jackpot+Giant',
      isNew: false,
      isHot: false,
      isFavorite: false,
    },
  ],
};

export default function Casino() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const gamesToShow = gamesData[selectedCategory] || gamesData.all;

  return (
    <div className={styles.casinoPage}>
      <div className={styles.casinoHero}>
        <div className="container">
          <h1><span>Trò chơi</span> Casino</h1>
          <p>Khám phá bộ sưu tập trò chơi casino cao cấp từ các nhà cung cấp hàng đầu thế giới. Tìm trò chơi yêu thích hoặc khám phá các trò chơi hấp dẫn mới!</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.casinoContent}>
          <div className={styles.casinoSidebar}>
            <div className={styles.searchBox}>
              <input type="text" placeholder="Tìm kiếm trò chơi..." />
              <button className="btn btn-primary">Tìm kiếm</button>
            </div>

            <div className={styles.providersFilter}>
              <h3>Nhà cung cấp</h3>
              <ul>
                <li><label><input type="checkbox" /> NetEnt</label></li>
                <li><label><input type="checkbox" /> Pragmatic Play</label></li>
                <li><label><input type="checkbox" /> Microgaming</label></li>
                <li><label><input type="checkbox" /> Play'n GO</label></li>
                <li><label><input type="checkbox" /> Evolution Gaming</label></li>
              </ul>
            </div>
          </div>

          <div className={styles.casinoMain}>
            <CategoryTabs
              categories={categories}
              onSelectCategory={handleSelectCategory}
            />

            <div className="grid-3">
              {gamesToShow.map((game, index) => (
                <GameCard key={index} game={game} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
