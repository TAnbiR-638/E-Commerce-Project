import Link from 'next/link';
import { MOCK_CATEGORIES } from '@/lib/data';
import styles from './CategorySection.module.css';

export default function CategorySection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Explore</div>
          <h2 className="section-title">Shop by <span className="gradient-text">Category</span></h2>
          <p className="section-subtitle">
            From cutting-edge electronics to timeless fashion — find everything you need.
          </p>
        </div>

        <div className={styles.grid}>
          {MOCK_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={styles.card}
              style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}
              id={`category-${cat.slug}`}
            >
              <div className={styles.iconWrap} style={{ background: cat.gradient }}>
                <span className={styles.icon}>{cat.icon}</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{cat.name}</h3>
                <span className={styles.count}>{cat.productCount} products</span>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.glow} style={{ background: cat.gradient }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
