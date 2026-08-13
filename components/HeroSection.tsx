'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

const HERO_SLIDES = [
  {
    tag: 'New Arrival 2024',
    title: 'Sony WH-1000XM5',
    subtitle: 'Wireless Noise-Canceling Headphones',
    description: 'Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life.',
    price: '$279.99',
    originalPrice: '$399.99',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=85',
    cta: { label: 'Shop Now', href: '/products/1' },
    accentColor: '#7c3aed',
  },
  {
    tag: 'Pro Performance',
    title: 'MacBook Pro 16"',
    subtitle: 'Powered by Apple M3 Pro Chip',
    description: 'Supercharged by M3 Pro. Immersive Liquid Retina XDR display and all-day battery.',
    price: '$1,999.99',
    originalPrice: '$2,499.99',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=85',
    cta: { label: 'Explore', href: '/products/2' },
    accentColor: '#06b6d4',
  },
  {
    tag: 'Iconic Style',
    title: 'Air Jordan 1 Retro',
    subtitle: 'High OG — Limited Release',
    description: 'The shoes that started it all. Premium leather upper with foam midsole cushioning.',
    price: '$180.00',
    originalPrice: '$180.00',
    discount: 'Just Dropped',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85',
    cta: { label: 'Get Yours', href: '/products/3' },
    accentColor: '#f59e0b',
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      switchSlide((active + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, [active]);

  const switchSlide = (idx: number) => {
    if (animating || idx === active) return;
    setPrevActive(active);
    setAnimating(true);
    setActive(idx);
    setTimeout(() => { setAnimating(false); setPrevActive(null); }, 600);
  };

  const slide = HERO_SLIDES[active];

  return (
    <section className={styles.hero} style={{ '--accent-color': slide.accentColor } as React.CSSProperties}>
      {/* Background glows */}
      <div className={styles.glowA} style={{ background: slide.accentColor }} />
      <div className={styles.glowB} />

      {/* Grid overlay */}
      <div className={styles.grid} />

      <div className="container">
        <div className={styles.inner}>
          {/* Left: Copy */}
          <div className={`${styles.copy} ${animating ? styles.fadeOut : styles.fadeIn}`}>
            <span className={`badge badge-primary ${styles.tag}`}>{slide.tag}</span>

            <h1 className={styles.title}>
              {slide.title}
            </h1>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <p className={styles.description}>{slide.description}</p>

            <div className={styles.priceGroup}>
              <span className={styles.price}>{slide.price}</span>
              {slide.originalPrice !== slide.price && (
                <span className={styles.originalPrice}>{slide.originalPrice}</span>
              )}
              <span className={`badge badge-error ${styles.discountBadge}`}>{slide.discount}</span>
            </div>

            <div className={styles.ctaGroup}>
              <Link href={slide.cta.href} className="btn btn-primary btn-lg" id={`hero-cta-${active}`}>
                {slide.cta.label} →
              </Link>
              <Link href="/products" className="btn btn-secondary btn-lg" id="hero-browse">
                Browse All
              </Link>
            </div>

            {/* Trust Badges */}
            <div className={styles.trust}>
              {[
                { icon: '🔒', label: 'Secure Checkout' },
                { icon: '🚚', label: 'Free Shipping $50+' },
                { icon: '↩️', label: '30-Day Returns' },
              ].map(t => (
                <div key={t.label} className={styles.trustItem}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Image */}
          <div className={`${styles.imageContainer} ${animating ? styles.imgOut : styles.imgIn}`}>
            <div className={styles.imageGlow} style={{ background: slide.accentColor }} />
            <div className={styles.imageWrapper}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className={styles.productImage}
              />
            </div>

            {/* Floating badge */}
            <div className={`${styles.floatingCard} animate-float`}>
              <div className={styles.floatingIcon}>🔥</div>
              <div>
                <div className={styles.floatingTitle}>Trending Now</div>
                <div className={styles.floatingValue}>#{active + 1} Best Seller</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className={styles.controls}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.activeDot : ''}`}
              onClick={() => switchSlide(i)}
              aria-label={`Slide ${i + 1}`}
              id={`hero-dot-${i}`}
            />
          ))}
          <div className={styles.progress}>
            <div
              className={styles.progressFill}
              style={{ background: slide.accentColor }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
