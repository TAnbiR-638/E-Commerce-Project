'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { productsApi } from '@/lib/api';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports & Fitness'];
const SORTS = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get('category');
  const querySearch = searchParams.get('search');
  
  // Try to match the queryCategory to one of our actual categories, otherwise 'All'
  const initialCategory = queryCategory 
    ? CATEGORIES.find(c => c.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') === queryCategory.toLowerCase()) || 'All'
    : 'All';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState('Featured');
  
  // Sync state if URL changes directly
  useEffect(() => {
    if (queryCategory) {
      const match = CATEGORIES.find(c => c.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') === queryCategory.toLowerCase());
      if (match) setActiveCategory(match);
    }
  }, [queryCategory]);

  useEffect(() => {
    let sortParam = '';
    if (activeSort === 'Newest') sortParam = 'newest';
    if (activeSort === 'Price: Low to High') sortParam = 'price-asc';
    if (activeSort === 'Price: High to Low') sortParam = 'price-desc';

    const params: Record<string, string> = { visible: 'true', limit: '50' };
    if (activeCategory !== 'All') params.category = activeCategory.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
    if (sortParam) params.sort = sortParam;
    if (querySearch) params.search = querySearch;

    setLoading(true);
    productsApi.getAll(params)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory, activeSort, querySearch]);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '2rem' }}>
          {querySearch ? `Search Results for "${querySearch}"` : 'All Products'}
        </h1>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select 
            className="input" 
            style={{ width: 'auto', padding: '8px 16px' }}
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            className="input" 
            style={{ width: 'auto', padding: '8px 16px' }}
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
          >
            {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ height: 400, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No products found.
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px 0', textAlign: 'center' }}>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
