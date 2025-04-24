'use client';

import styles from './card-games.module.scss';

export default function CardGamesPage() {
  // Thay đổi cách redirect để không sử dụng useRouter
  if (typeof window !== 'undefined') {
    window.location.href = '/?tab=card-games';
  }

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
