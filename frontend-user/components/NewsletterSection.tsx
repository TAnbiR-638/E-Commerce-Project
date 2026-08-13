'use client';
import { useState } from 'react';
import styles from './NewsletterSection.module.css';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.glow} />
          <div className={styles.content}>
            <div className={styles.emoji}>📧</div>
            <h2 className={styles.title}>
              Get <span className="gradient-text">Exclusive Deals</span>
            </h2>
            <p className={styles.subtitle}>
              Subscribe to our newsletter and get 10% off your first order, plus early access to sales and new arrivals.
            </p>

            {submitted ? (
              <div className={styles.success}>
                <span>🎉</span>
                <span>You're in! Check your inbox for a 10% discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} id="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                  required
                  id="newsletter-email"
                />
                <button type="submit" className="btn btn-primary btn-lg" id="newsletter-submit">
                  Subscribe →
                </button>
              </form>
            )}

            <p className={styles.disclaimer}>
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
