'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './popular.module.scss';

export default function PopularPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with tab=popular
    router.push('/?tab=popular');
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
