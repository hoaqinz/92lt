'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './card-games.module.scss';

export default function CardGamesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with tab=card-games
    router.push('/?tab=card-games');
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
