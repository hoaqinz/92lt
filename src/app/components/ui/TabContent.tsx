'use client';

import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import styles from './TabContent.module.scss';

interface Game {
  id: string;
  title: string;
  provider: string;
  image: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  // Dữ liệu cho tab Xổ số
  const lotteryGames: Game[] = [
    {
      id: 'win-go',
      title: 'Win Go',
      provider: '92LOTTERY',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff0000?text=Win+Go',
      isHot: true
    },
    {
      id: 'k3-lotre',
      title: 'K3 Lotre',
      provider: '92LOTTERY',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff0000?text=K3+Lotre',
      isNew: true
    },
    {
      id: '5d-lotre',
      title: '5D Lotre',
      provider: '92LOTTERY',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff0000?text=5D+Lotre',
    }
  ];

  // Dữ liệu cho tab Slots
  const slotGames: Game[] = [
    {
      id: 'pg-game',
      title: 'PG Game',
      provider: 'Pocket Games',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=PG+Game',
      isHot: true
    },
    {
      id: 'jili-game',
      title: 'JILI Game',
      provider: 'JILI',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=JILI+Game',
    },
    {
      id: 'jdb-game',
      title: 'JDB Game',
      provider: 'JDB',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=JDB+Game',
    },
    {
      id: 'cq9-game',
      title: 'CQ9 Game',
      provider: 'CQ9',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=CQ9+Game',
      isNew: true
    },
    {
      id: 'ag-game',
      title: 'AG Game',
      provider: 'AG',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=AG+Game',
    },
    {
      id: 'm-game',
      title: 'M Game',
      provider: 'M Gaming',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=M+Game',
    },
    {
      id: 'pp-game',
      title: 'PP Game',
      provider: 'Pragmatic Play',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=PP+Game',
      isHot: true
    },
    {
      id: 'evolution',
      title: 'Evolution',
      provider: 'Evolution Gaming',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=Evolution',
    },
    {
      id: 'g9',
      title: 'G9',
      provider: 'G9 Gaming',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=G9',
      isNew: true
    },
    {
      id: 'm-fish',
      title: 'M Fish',
      provider: 'M Gaming',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ffcc00?text=M+Fish',
    }
  ];

  // Dữ liệu cho tab Thể Thao
  const sportsGames: Game[] = [
    {
      id: 'saba-sports',
      title: 'Saba Thể Thao',
      provider: 'Saba Sports',
      image: 'https://via.placeholder.com/300x300/1a1a1a/00ff00?text=Saba+Sports',
      isHot: true
    },
    {
      id: 'cmd-sports',
      title: 'CMD Thể Thao',
      provider: 'CMD368',
      image: 'https://via.placeholder.com/300x300/1a1a1a/00ff00?text=CMD+Sports',
    }
  ];

  // Dữ liệu cho tab Casino
  const casinoGames: Game[] = [
    {
      id: 'dg-casino',
      title: 'DG Casino Dream Gaming',
      provider: 'Dream Gaming',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=DG+Casino',
      isHot: true
    },
    {
      id: 'wm-casino',
      title: 'WM Casino',
      provider: 'WM',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=WM+Casino',
    },
    {
      id: 'evo-casino',
      title: 'Evo Casino',
      provider: 'Evolution Gaming',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=Evo+Casino',
      isNew: true
    },
    {
      id: 'ag-casino',
      title: 'AG Casino',
      provider: 'AG',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=AG+Casino',
    },
    {
      id: 'mg-live',
      title: 'MG Live',
      provider: 'MG',
      image: 'https://via.placeholder.com/300x300/1a1a1a/0088ff?text=MG+Live',
    }
  ];

  // Dữ liệu cho tab Game Bài
  const cardGames: Game[] = [
    {
      id: 'v8-poker',
      title: 'V8 Poker',
      provider: 'V8',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff00ff?text=V8+Poker',
      isHot: true
    },
    {
      id: '365-games',
      title: '365 Games',
      provider: '365',
      image: 'https://via.placeholder.com/300x300/1a1a1a/ff00ff?text=365+Games',
      isNew: true
    }
  ];

  // Dữ liệu tạm thời cho tab Bắn Cá (15 thẻ)
  const fishingGames: Game[] = Array.from({ length: 15 }, (_, i) => ({
    id: `fishing-${i + 1}`,
    title: `Bắn Cá ${i + 1}`,
    provider: 'Game Provider',
    image: `https://via.placeholder.com/300x300/1a1a1a/00ffff?text=Fishing+Game+${i + 1}`,
    isNew: i === 0,
    isHot: i === 1
  }));

  // Dữ liệu tạm thời cho tab Mini Game (21 thẻ)
  const miniGames: Game[] = Array.from({ length: 21 }, (_, i) => ({
    id: `mini-game-${i + 1}`,
    title: `Mini Game ${i + 1}`,
    provider: 'Game Provider',
    image: `https://via.placeholder.com/300x300/1a1a1a/ffaa00?text=Mini+Game+${i + 1}`,
    isNew: i === 0,
    isHot: i === 1
  }));

  // Dữ liệu tạm thời cho tab Phổ Biến (30 thẻ)
  const popularGames: Game[] = Array.from({ length: 30 }, (_, i) => ({
    id: `popular-${i + 1}`,
    title: `Game Phổ Biến ${i + 1}`,
    provider: 'Game Provider',
    image: `https://via.placeholder.com/300x300/1a1a1a/ff3366?text=Popular+Game+${i + 1}`,
    isNew: i === 0,
    isHot: i === 1
  }));

  // Hiển thị danh sách game dựa trên tab đang active
  const renderGames = () => {
    let games: Game[] = [];

    switch (activeTab) {
      case 'lottery':
        games = lotteryGames;
        break;
      case 'slots':
        games = slotGames;
        break;
      case 'sports':
        games = sportsGames;
        break;
      case 'casino':
        games = casinoGames;
        break;
      case 'card-games':
        games = cardGames;
        break;
      case 'fishing':
        games = fishingGames;
        break;
      case 'mini-games':
        games = miniGames;
        break;
      case 'popular':
        games = popularGames;
        break;
      default:
        games = popularGames;
    }

    return (
      <div className="grid-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    );
  };

  // Lấy tiêu đề cho tab hiện tại
  const getTabTitle = () => {
    switch (activeTab) {
      case 'lottery':
        return 'Xổ số';
      case 'slots':
        return 'Slots';
      case 'sports':
        return 'Thể thao';
      case 'casino':
        return 'Casino';
      case 'card-games':
        return 'Game bài';
      case 'fishing':
        return 'Bắn cá';
      case 'mini-games':
        return 'Mini game';
      case 'popular':
        return 'Phổ biến';
      default:
        return 'Phổ biến';
    }
  };



  // State để lưu trữ dữ liệu từ localStorage
  const [storedGames, setStoredGames] = useState<Record<string, Game[]>>({});
  const [isClient, setIsClient] = useState(false);

  // Đánh dấu khi component được mount ở client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lấy dữ liệu game từ localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      // Lấy dữ liệu từ localStorage
      const storedIcons = JSON.parse(localStorage.getItem('siteIcons') || '[]');

      // Nhóm các icon theo danh mục
      const gamesByCategory: Record<string, Game[]> = {};

      // Lọc các icon đang active và nhóm theo danh mục
      storedIcons.forEach((icon: any) => {
        if (icon.active) {
          const category = icon.category;
          if (!gamesByCategory[category]) {
            gamesByCategory[category] = [];
          }

          gamesByCategory[category].push({
            id: icon.id,
            title: icon.title,
            provider: 'Game Provider',
            image: icon.image,
            isNew: false,
            isHot: false
          });
        }
      });

      setStoredGames(gamesByCategory);
    } catch (err) {
      console.error('Error loading games from localStorage:', err);
    }
  }, [isClient]);

  // Lấy danh sách game dựa trên tab đang active
  const getGames = () => {
    // Nếu có dữ liệu trong localStorage cho tab hiện tại, sử dụng nó
    if (isClient && storedGames[activeTab] && storedGames[activeTab].length > 0) {
      return storedGames[activeTab];
    }

    // Nếu không có dữ liệu trong localStorage, sử dụng dữ liệu mặc định
    return activeTab === 'lottery' ? lotteryGames :
           activeTab === 'slots' ? slotGames :
           activeTab === 'sports' ? sportsGames :
           activeTab === 'casino' ? casinoGames :
           activeTab === 'card-games' ? cardGames :
           activeTab === 'fishing' ? fishingGames :
           activeTab === 'mini-games' ? miniGames :
           popularGames;
  };

  return (
    <div className={styles.tabContent}>
      <div className="grid-4">
        {getGames().map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default TabContent;
