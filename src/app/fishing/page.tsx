'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './fishing.module.scss';

export default function FishingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with tab=fishing
    router.push('/?tab=fishing');
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
