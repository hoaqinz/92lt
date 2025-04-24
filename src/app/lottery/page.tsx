'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './lottery.module.scss';

export default function LotteryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with tab=lottery
    router.push('/?tab=lottery');
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
