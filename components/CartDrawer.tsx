'use client';

import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { cart, cartOpen, closeCart, cartTotal, removeFromCart, updateQty } = useApp();

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div className={styles.overlay} onClick={closeCart} aria-label="Close cart" />
      )}

      {/* Drawer */}
      <aside className={`${styles.drawer} ${cartOpen ? styles.open : ''}`} aria-label="Shopping cart">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🛒</span>
            <h2 className={styles.headerTitle}>Your Cart</h2>
            {cart.length > 0 && (
              <span className="badge badge-primary">{cart.length}</span>
            )}
          </div>
          <button className="btn btn-icon btn-ghost" onClick={closeCart} id="cart-close-btn">✕</button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started</p>
            <button className="btn btn-primary" onClick={closeCart} id="cart-continue-btn">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {cart.map((item, i) => (
                <div key={`${item.product.id}-${i}`} className={`${styles.item} animate-fade-in-up`}>
                  {/* Image */}
                  <div className={styles.itemImage}>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className={styles.itemInfo}>
                    <Link
                      href={`/products/${item.product.id}`}
                      className={styles.itemName}
                      onClick={closeCart}
                    >
                      {item.product.name}
                    </Link>
                    <span className={styles.itemBrand}>{item.product.brand}</span>
                    <div className={styles.itemFooter}>
                      {/* Qty Control */}
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          id={`cart-qty-dec-${item.product.id}`}
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          id={`cart-qty-inc-${item.product.id}`}
                        >+</button>
                      </div>

                      <span className={styles.itemPrice}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    className={`${styles.removeBtn} btn btn-icon btn-ghost`}
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label="Remove item"
                    id={`cart-remove-${item.product.id}`}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.free}>{cartTotal > 50 ? 'FREE' : formatPrice(9.99)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax (8%)</span>
                  <span>{formatPrice(cartTotal * 0.08)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <strong>Total</strong>
                  <strong className={styles.totalAmount}>
                    {formatPrice(cartTotal + (cartTotal > 50 ? 0 : 9.99) + cartTotal * 0.08)}
                  </strong>
                </div>
              </div>

              {cartTotal > 50 && (
                <div className={styles.freeShippingBanner}>
                  ✅ You qualify for <strong>FREE shipping</strong>!
                </div>
              )}

              <Link
                href="/checkout"
                className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}
                onClick={closeCart}
                id="cart-checkout-btn"
              >
                Proceed to Checkout →
              </Link>
              <Link
                href="/cart"
                className={`btn btn-secondary ${styles.viewCartBtn}`}
                onClick={closeCart}
                id="cart-view-btn"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
