'use client';

const MOCK_CUSTOMERS = [
  { id: 'u1', name: 'Ahmed Rahman',  email: 'ahmed@example.com',  role: 'USER',  orders: 3, spent: 2149.47, joined: '2024-01-15' },
  { id: 'u2', name: 'Sarah Mitchell',email: 'sarah@example.com',  role: 'USER',  orders: 1, spent: 279.99,  joined: '2024-02-10' },
  { id: 'u3', name: 'James Chen',    email: 'james@example.com',  role: 'USER',  orders: 2, spent: 449.98,  joined: '2024-03-01' },
  { id: 'u4', name: 'Admin User',    email: 'admin@novashop.com', role: 'ADMIN', orders: 0, spent: 0,       joined: '2024-01-01' },
];

import { formatPrice } from '@/lib/utils';
import styles from '../page.module.css';

export default function AdminCustomersPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem' }}>Customers</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{MOCK_CUSTOMERS.length} registered customers</p>
        </div>
        <button className="btn btn-secondary">Export</button>
      </div>

      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table className={styles.table} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMERS.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${c.role === 'ADMIN' ? 'badge-error' : 'badge-accent'}`}>{c.role}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{c.orders}</td>
                <td style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(c.spent)}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.joined}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm">View</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Block</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
