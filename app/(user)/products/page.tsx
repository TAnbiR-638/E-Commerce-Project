'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/data';
import { filterProducts } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import styles from './products.module.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    const filter = searchParams.get('filter');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
    if (filter === 'new') { /* handled by sort */ }
  }, [searchParams]);

  const products = filterProducts(MOCK_PRODUCTS, {
    category: selectedCategory,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    search: searchQuery,
    sort,
  });

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {selectedCategory === 'all' ? 'All Products' : MOCK_CATEGORIES.find(c => c.slug === selectedCategory)?.name || 'Products'}
          </h1>
          <p className={styles.resultCount}>{products.length} products found</p>
        </div>
        <div className={styles.headerActions}>
          <div className="input-icon" style={{ width: 280 }}>
            <span className="icon">🔍</span>
            <input
              type="text"
              className="input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="products-search"
            />
          </div>
          <select
            className="input"
            style={{ width: 200 }}
            value={sort}
            onChange={e => setSort(e.target.value)}
            id="products-sort"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            id="toggle-filters"
          >
            🎛️ Filters
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <div className={styles.filterList}>
              <button
                className={`${styles.filterItem} ${selectedCategory === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedCategory('all')}
                id="filter-all"
              >
                All Products
                <span className={styles.filterCount}>{MOCK_PRODUCTS.length}</span>
              </button>
              {MOCK_CATEGORIES.map(cat => (
                <button
                  key={cat.slug}
                  className={`${styles.filterItem} ${selectedCategory === cat.slug ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  id={`filter-cat-${cat.slug}`}
                >
                  {cat.icon} {cat.name}
                  <span className={styles.filterCount}>{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Price Range</h3>
            <div className={styles.priceRange}>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  className="input"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                  id="price-min"
                />
                <span>—</span>
                <input
                  type="number"
                  className="input"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                  id="price-max"
                />
              </div>
              <input
                type="range"
                min={0}
                max={3000}
                step={50}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                className={styles.rangeSlider}
                id="price-range-slider"
              />
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Special Offers</h3>
            <div className={styles.filterList}>
              <label className={styles.checkItem}>
                <input type="checkbox" id="filter-sale" /> On Sale
              </label>
              <label className={styles.checkItem}>
                <input type="checkbox" id="filter-new" /> New Arrivals
              </label>
              <label className={styles.checkItem}>
                <input type="checkbox" id="filter-bestseller" /> Best Sellers
              </label>
              <label className={styles.checkItem}>
                <input type="checkbox" id="filter-instock" /> In Stock Only
              </label>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={() => { setSelectedCategory('all'); setPriceRange([0, 3000]); setSearchQuery(''); }}
            id="clear-filters"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className={styles.main}>
          {products.length === 0 ? (
            <div className={styles.empty}>
              <div>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
