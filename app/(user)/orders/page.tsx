'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { MOCK_ORDERS } from '@/lib/data';
import { formatPrice, formatDate, ORDER_STATUS_CONFIG } from '@/lib/utils';
import styles from './orders.module.css';

function OrdersContent() {
  const { user } = useApp();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccess(true);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Please Sign In</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You need to be signed in to view your orders.</p>
        <Link href="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {success && (
        <div style={{ marginBottom: '32px', padding: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
          <h2 style={{ color: '#34d399', marginBottom: '8px' }}>Thank you for your order!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>We've received your order and will begin processing it shortly.</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>My Orders</h1>
        <span className="badge badge-primary">{MOCK_ORDERS.length} Orders</span>
      </div>

      <div className={styles.orderList}>
        {MOCK_ORDERS.map(order => {
          const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
          
          return (
            <div key={order.id} className="glass-card animate-fade-in-up" style={{ padding: '24px' }}>
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <div>
                    <span className={styles.metaLabel}>Order Placed</span>
                    <span className={styles.metaValue}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className={styles.metaLabel}>Total</span>
                    <span className={styles.metaValue}>{formatPrice(order.total)}</span>
                  </div>
                  <div>
                    <span className={styles.metaLabel}>Order #</span>
                    <span className={styles.metaValue}>{order.id}</span>
                  </div>
                </div>
                
                <div className={styles.orderStatus} style={{ color: `var(--${statusConfig.color})` }}>
                  <span>{statusConfig.icon}</span> {statusConfig.label}
                </div>
              </div>

              <div className="divider" style={{ margin: '16px 0' }} />

              <div className={styles.orderItems}>
                {order.items.map((item, idx) => (
                  <div key={idx} className={styles.item}>
                    <div className={styles.itemImage}>
                      <img src={item.product.images[0]} alt={item.product.name} />
                    </div>
                    <div className={styles.itemInfo}>
                      <Link href={`/products/${item.product.id}`} className={styles.itemName}>
                        {item.product.name}
                      </Link>
                      <div className={styles.itemQty}>Qty: {item.quantity}</div>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <div className={styles.itemActions}>
                      <Link href={`/products/${item.product.id}`} className="btn btn-secondary btn-sm">Buy Again</Link>
                      <button className="btn btn-ghost btn-sm">Write Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
