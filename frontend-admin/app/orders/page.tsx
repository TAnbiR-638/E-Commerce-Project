'use client';

import { useState } from 'react';
import { MOCK_ORDERS } from '@/lib/data';
import { formatPrice, formatDate, ORDER_STATUS_CONFIG } from '@/lib/utils';
import styles from '../page.module.css';

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState('ALL');
  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{MOCK_ORDERS.length} total orders</p>
        </div>
        <button className="btn btn-secondary">Export CSV</button>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button
            key={s}
            className={`chip ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table className={styles.table} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => {
              const statusConf = ORDER_STATUS_CONFIG[order.status];
              return (
                <tr key={order.id}>
                  <td className={styles.orderNum}>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: `var(--${statusConf?.color})`, fontWeight: 600, fontSize: '0.82rem' }}>
                      {statusConf?.icon} {statusConf?.label}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-error'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(order.total)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm">View</button>
                      <button className="btn btn-ghost btn-sm">Update</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No orders with status: {filter}
          </div>
        )}
      </div>
    </div>
  );
}
