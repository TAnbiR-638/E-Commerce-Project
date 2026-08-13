'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty } = useApp();

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <h1 style={{ marginBottom: '32px' }}>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="glass-card" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', opacity: 0.5, marginBottom: '16px' }}>🛒</div>
          <h3 style={{ marginBottom: '8px' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.product.id} className="glass-card" style={{ display: 'flex', padding: '16px', gap: '24px', alignItems: 'center' }}>
                <Link href={`/products/${item.product.id}`} style={{ display: 'block', position: 'relative', width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-elevated)' }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                </Link>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Link href={`/products/${item.product.id}`} style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {item.product.name}
                      </Link>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.product.brand}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-light)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.product.id, item.quantity - 1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>+</button>
                    </div>

                    <button 
                      className="btn btn-ghost btn-sm" 
                      style={{ color: 'var(--error)' }}
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: cartTotal > 50 ? 'var(--success)' : 'inherit' }}>
                  {cartTotal > 50 ? 'FREE' : formatPrice(9.99)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tax (8%)</span>
                <span>{formatPrice(cartTotal * 0.08)}</span>
              </div>
              
              <div className="divider" style={{ margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-light)' }}>
                  {formatPrice(cartTotal + (cartTotal > 50 ? 0 : 9.99) + cartTotal * 0.08)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Checkout
            </Link>

            <div style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <span>🔒 Secure Checkout</span>
                <span>↩️ 30-Day Returns</span>
              </div>
              <div>Accepted: Visa, Mastercard, AMEX, PayPal</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
