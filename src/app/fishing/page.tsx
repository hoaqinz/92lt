'use client';

import styles from './fishing.module.scss';

export default function FishingPage() {
  // Thay đổi cách redirect để không sử dụng useRouter
  if (typeof window !== 'undefined') {
    window.location.href = '/?tab=fishing';
  }

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
