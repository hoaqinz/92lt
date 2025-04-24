'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './slots.module.scss';

export default function SlotsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with tab=slots
    router.push('/?tab=slots');
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
