'use client';

import { useState } from 'react';
import { MOCK_PRODUCTS } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import styles from '../page.module.css';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{MOCK_PRODUCTS.length} total products</p>
        </div>
        <button className="btn btn-primary">+ Add Product</button>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="input-icon" style={{ maxWidth: 360 }}>
            <span className="icon">🔍</span>
            <input
              type="text"
              className="input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table} style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
                        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{product.category}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(product.price)}</td>
                  <td>
                    <span style={{ color: product.stock === 0 ? 'var(--error)' : product.stock < 20 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock}
                    </span>
                  </td>
                  <td>⭐ {product.rating}</td>
                  <td>
                    <span className={`badge ${product.isFeatured ? 'badge-accent' : 'badge-primary'}`}>
                      {product.isFeatured ? 'Featured' : product.isNew ? 'New' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm">Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
