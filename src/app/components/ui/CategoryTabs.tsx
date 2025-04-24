'use client';

import { useState } from 'react';
import styles from './CategoryTabs.module.scss';

interface CategoryTabsProps {
  categories: {
    id: string;
    name: string;
    icon?: React.ReactNode;
  }[];
  onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs = ({ categories, onSelectCategory }: CategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className={styles.categoryTabs}>
      <div className={styles.tabsContainer}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.tab} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.icon && <span className={styles.tabIcon}>{category.icon}</span>}
            <span className={styles.tabText}>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
