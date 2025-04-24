'use client';

import styles from './popular.module.scss';

export default function PopularPage() {
  // Thay đổi cách redirect để không sử dụng useRouter
  if (typeof window !== 'undefined') {
    window.location.href = '/?tab=popular';
  }

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}
