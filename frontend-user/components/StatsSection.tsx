import styles from './StatsSection.module.css';

const STATS = [
  { value: '50K+', label: 'Happy Customers', icon: '😊' },
  { value: '12K+', label: 'Products Available', icon: '📦' },
  { value: '99.2%', label: 'Satisfaction Rate', icon: '⭐' },
  { value: '24/7', label: 'Customer Support', icon: '💬' },
];

export default function StatsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={styles.card}
              style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <div className={styles.icon}>{stat.icon}</div>
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
