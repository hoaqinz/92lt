'use client';

import styles from './slots.module.scss';

export default function SlotsPage() {
  // Thay đổi cách redirect để không sử dụng useRouter
  if (typeof window !== 'undefined') {
    window.location.href = '/?tab=slots';
  }

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
