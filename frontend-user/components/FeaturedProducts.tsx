'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import ProductCard from './ProductCard';
import styles from './FeaturedProducts.module.css';

const TABS = ['All', 'Best Sellers', 'New Arrivals', 'On Sale'];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll({ visible: 'true', limit: '20' })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load featured products:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (activeTab === 'Best Sellers') return p.isBestSeller;
    if (activeTab === 'New Arrivals') return p.isNew;
    if (activeTab === 'On Sale') return p.discount && p.discount > 0;
    return p.isFeatured || p.isBestSeller || p.isNew;
  }).slice(0, 8);

  return (
    <section className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className={styles.header}>
          <div className="section-header" style={{ marginBottom: 0, textAlign: 'left' }}>
            <div className="section-tag">Products</div>
            <h2 className="section-title">
              Featured <span className="gradient-text">Products</span>
            </h2>
          </div>

          {/* Tab Filters */}
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
                id={`tab-${tab.replace(/\\s+/g, '-').toLowerCase()}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading amazing products...
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 50}ms` }}
                className="animate-fade-in-up"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No products found for this category.
          </div>
        )}

        <div className={styles.viewAll}>
          <Link href="/products" className="btn btn-secondary btn-lg" id="view-all-products">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
