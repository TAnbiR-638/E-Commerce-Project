'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '@/lib/data';
import styles from './page.module.css';

const STATS = [
  { label: 'Total Revenue',  value: '$2,149.47', trend: '+12.5%', up: true,  icon: '💰' },
  { label: 'Total Orders',   value: '3',         trend: '+5.2%',  up: true,  icon: '🛍️' },
  { label: 'Total Products', value: '12',        trend: '—',      up: null,  icon: '📦' },
  { label: 'Active Users',   value: '1,248',     trend: '+18.1%', up: true,  icon: '👥' },
];

export default function AdminDashboardPage() {
  const { user } = useApp();

  return (
    <div>
      <div className={styles.welcome}>
        <h1>Good morning, <span className="gradient-text">{user?.name ?? 'Admin'}</span> 👋</h1>
        <p>Here's what's happening with your store today.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {STATS.map(stat => (
          <div key={stat.label} className={`glass-card ${styles.statCard}`}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
            {stat.up !== null && (
              <div className={styles.statTrend} style={{ color: stat.up ? 'var(--success)' : 'var(--error)' }}>
                {stat.up ? '↑' : '↓'} {stat.trend} vs last month
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Orders */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className={styles.cardHeader}>
            <h3>Recent Orders</h3>
            <Link href="/admin/orders" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map(order => (
                <tr key={order.id}>
                  <td className={styles.orderNum}>{order.id.split('-').pop()}</td>
                  <td>{order.userId}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'DELIVERED' ? 'badge-success' :
                      order.status === 'SHIPPED'   ? 'badge-accent'  :
                      order.status === 'PROCESSING'? 'badge-warning' : 'badge-primary'
                    }`}>{order.status}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className={styles.cardHeader}>
            <h3>Top Products</h3>
            <Link href="/admin/products" className="btn btn-ghost btn-sm">Manage →</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.filter(p => p.isBestSeller).map(p => (
                <tr key={p.id}>
                  <td className={styles.productName}>{p.name}</td>
                  <td>
                    <span style={{ color: p.stock < 20 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                      {p.stock}
                    </span>
                  </td>
                  <td>{formatPrice(p.price)}</td>
                  <td>⭐ {p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
