'use client';

import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { productsApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch all products and filter locally for simplicity, 
    // or ideally fetch by IDs if the API supports it.
    productsApi.getAll({ visible: 'true', limit: '100' })
      .then(res => {
        const filtered = res.data.filter(p => wishlist.includes(p.id));
        setProducts(filtered);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Your Wishlist</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
      </p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 400, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '80px 0', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', marginTop: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤍</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Save items you love to build your perfect collection.</p>
          <Link href="/products" className="btn btn-primary btn-lg">
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
