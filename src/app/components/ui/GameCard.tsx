'use client';

import { useState, useRef, useEffect } from 'react';
import { FaStar, FaPlay, FaGamepad } from 'react-icons/fa';
import styles from './GameCard.module.scss';

interface GameProps {
  game: {
    title: string;
    provider: string;
    image: string;
    isNew?: boolean;
    isHot?: boolean;
    isFavorite?: boolean;
  };
}

const GameCard = ({ game }: GameProps) => {
  const { title, image, provider, isNew = false, isFavorite = false, isHot = false } = game;
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Hiệu ứng 3D khi di chuột
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotation({ x: rotateX, y: rotateY });
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Hiệu ứng ánh sáng theo vị trí chuột
  const lightPosition = {
    x: position.x,
    y: position.y,
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.gameCard} ${isHovered ? styles.hovered : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)` : '',
        transition: isHovered ? 'transform 0.1s ease' : 'transform 0.5s ease'
      }}
    >
      <div className={styles.gameCardInner}>
        <div className={styles.gameCardImage}>
          <img src={image} alt={title} />
          <div className={styles.sweepingBorder}></div>
          <div
            className={styles.lightReflection}
            style={{
              background: isHovered ? `radial-gradient(circle at ${lightPosition.x}px ${lightPosition.y}px, rgba(255, 255, 255, 0.15) 0%, transparent 50%)` : '',
              opacity: isHovered ? 1 : 0
            }}
          ></div>
          <div className={styles.gameCardOverlay}>
            <button className={`${styles.playButton} btn btn-primary`}>
              <FaPlay className={styles.playIcon} /> Chơi ngay
            </button>
            <button className={`${styles.demoButton} btn btn-secondary`}>
              <FaGamepad className={styles.demoIcon} /> Thử
            </button>
          </div>
          <div className={styles.gameCardBadges}>
            {isNew && <span className={`${styles.badge} ${styles.newBadge}`}>Mới</span>}
            {isHot && <span className={`${styles.badge} ${styles.hotBadge}`}>Hot</span>}
          </div>
          <button className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}>
            <FaStar />
            <span className={styles.favoriteRing}></span>
          </button>
        </div>
        <div className={styles.gameCardContent}>
          <h3 className={styles.gameTitle}>{title}</h3>
          <p className={styles.gameProvider}>{provider}</p>
        </div>
        <div className={styles.cardGlow}></div>
      </div>
    </div>
  );
};

export default GameCard;
