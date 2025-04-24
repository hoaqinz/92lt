'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './mini-games.module.scss';

export default function MiniGamesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with tab=mini-games
    router.push('/?tab=mini-games');
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
