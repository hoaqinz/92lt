'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('popular');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Link href="/">
              <h1><span>92</span>LOTTERY</h1>
            </Link>
          </div>

          <div className={styles.navToggle} onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <nav className={`${styles.mainNav} ${isMenuOpen ? styles.show : ''}`}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/?tab=lottery" className={`${styles.navLink} ${activeTab === 'lottery' ? styles.active : ''}`}>
                  Xổ số
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=slots" className={`${styles.navLink} ${activeTab === 'slots' ? styles.active : ''}`}>
                  Slots
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=sports" className={`${styles.navLink} ${activeTab === 'sports' ? styles.active : ''}`}>
                  Thể thao
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=casino" className={`${styles.navLink} ${activeTab === 'casino' ? styles.active : ''}`}>
                  Casino
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=card-games" className={`${styles.navLink} ${activeTab === 'card-games' ? styles.active : ''}`}>
                  Game bài
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=fishing" className={`${styles.navLink} ${activeTab === 'fishing' ? styles.active : ''}`}>
                  Bắn cá
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=mini-games" className={`${styles.navLink} ${activeTab === 'mini-games' ? styles.active : ''}`}>
                  Mini game
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/?tab=popular" className={`${styles.navLink} ${activeTab === 'popular' ? styles.active : ''}`}>
                  Phổ biến
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/posts" className={`${styles.navLink} ${activeTab === 'posts' ? styles.active : ''}`}>
                  Tin tức
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.headerActions}>
            <div className={styles.authButtons}>
              <button className="btn btn-secondary">Đăng nhập</button>
              <button className="btn btn-primary">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
