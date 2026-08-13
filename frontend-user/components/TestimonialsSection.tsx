import styles from './TestimonialsSection.module.css';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'UX Designer',
    avatar: 'SM',
    rating: 5,
    text: 'NovaShop is hands-down the best online shopping experience I\'ve had. The product quality is exceptional, shipping was super fast, and their customer service team resolved my query in under an hour.',
    product: 'Sony WH-1000XM5',
  },
  {
    name: 'Ahmed Rahman',
    role: 'Software Engineer',
    avatar: 'AR',
    rating: 5,
    text: 'Ordered the MacBook Pro and received it in perfect condition, two days early! The price beat every competitor I checked. Will definitely be my go-to for all future tech purchases.',
    product: 'MacBook Pro 16" M3',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    avatar: 'PS',
    rating: 5,
    text: 'The checkout process was seamless and secure. I love the real-time order tracking feature. NovaShop has completely changed how I think about online shopping.',
    product: 'Samsung Galaxy S24',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Reviews</div>
          <h2 className="section-title">What Our <span className="gradient-text">Customers Say</span></h2>
          <p className="section-subtitle">Join over 50,000 satisfied customers who trust NovaShop.</p>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`${styles.card} glass-card`} style={{ animationDelay: `${i * 100}ms` }}>
              {/* Stars */}
              <div className="stars">
                {[...Array(t.rating)].map((_, s) => (
                  <span key={s} className="star">★</span>
                ))}
              </div>

              <p className={styles.text}>"{t.text}"</p>

              <div className={styles.footer}>
                <div className="avatar">{t.avatar}</div>
                <div className={styles.info}>
                  <strong className={styles.name}>{t.name}</strong>
                  <span className={styles.role}>{t.role}</span>
                </div>
                <span className="badge badge-primary">{t.product}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className={styles.trust}>
          <div className={styles.trustStat}>
            <span className={styles.trustIcon}>⭐</span>
            <strong>4.9/5</strong>
            <span>Average rating</span>
          </div>
          <div className={styles.trustStat}>
            <span className={styles.trustIcon}>✅</span>
            <strong>127K+</strong>
            <span>Verified reviews</span>
          </div>
          <div className={styles.trustStat}>
            <span className={styles.trustIcon}>🏆</span>
            <strong>#1</strong>
            <span>Customer satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
}
