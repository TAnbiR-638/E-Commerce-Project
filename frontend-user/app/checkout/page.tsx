'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      clearCart();
      showToast('Payment successful! Order placed.', 'success');
      router.push('/orders?success=true');
    }, 2000);
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ margin: '16px 0 24px', color: 'var(--text-muted)' }}>You need items in your cart to checkout.</p>
        <Link href="/products" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 50 ? 0 : 9.99;
  const total = cartTotal + tax + shipping;

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

      <div className={styles.layout}>
        {/* Forms */}
        <div className={styles.main}>
          {/* Progress Steps */}
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
              <div className={styles.stepNum}>1</div>
              <span>Shipping</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.active : ''}`} />
            <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
              <div className={styles.stepNum}>2</div>
              <span>Payment</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.active : ''}`} />
            <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
              <div className={styles.stepNum}>3</div>
              <span>Review</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            {step === 1 && (
              <form onSubmit={handleNext} className="animate-fade-in">
                <h3 style={{ marginBottom: '24px' }}>Shipping Information</h3>
                
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label">Email Address</label>
                  <input required type="email" name="email" className="input" value={formData.email} onChange={handleChange} />
                </div>

                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">First Name</label>
                    <input required type="text" name="firstName" className="input" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Last Name</label>
                    <input required type="text" name="lastName" className="input" value={formData.lastName} onChange={handleChange} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label">Street Address</label>
                  <input required type="text" name="address" className="input" value={formData.address} onChange={handleChange} />
                </div>

                <div className="grid-3" style={{ marginBottom: '32px' }}>
                  <div className="input-group">
                    <label className="input-label">City</label>
                    <input required type="text" name="city" className="input" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">State/Province</label>
                    <input required type="text" name="state" className="input" value={formData.state} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">ZIP / Postal</label>
                    <input required type="text" name="zip" className="input" value={formData.zip} onChange={handleChange} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Continue to Payment</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3>Payment Method</h3>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>Edit Shipping</button>
                </div>

                <div className={styles.paymentMethods}>
                  <label className={`${styles.paymentMethod} ${styles.active}`}>
                    <input type="radio" name="payment" defaultChecked />
                    💳 Credit Card (Stripe Test)
                  </label>
                  <label className={styles.paymentMethod}>
                    <input type="radio" name="payment" disabled />
                    PayPal (Coming Soon)
                  </label>
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label">Card Number</label>
                  <input required type="text" name="cardNumber" placeholder="4242 4242 4242 4242" className="input" value={formData.cardNumber} onChange={handleChange} />
                </div>

                <div className="grid-2" style={{ marginBottom: '32px' }}>
                  <div className="input-group">
                    <label className="input-label">Expiry Date</label>
                    <input required type="text" name="expiry" placeholder="MM/YY" className="input" value={formData.expiry} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">CVC</label>
                    <input required type="text" name="cvc" placeholder="123" className="input" value={formData.cvc} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid-2">
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn btn-primary btn-lg">Review Order</button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3>Review Your Order</h3>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(2)}>Edit Payment</button>
                </div>

                <div className={styles.reviewSection}>
                  <h4>Shipping To:</h4>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.email}</p>
                </div>

                <div className={styles.reviewSection}>
                  <h4>Payment Method:</h4>
                  <p>Credit Card ending in {formData.cardNumber.slice(-4) || '****'}</p>
                </div>

                <div className="grid-2" style={{ marginTop: '32px' }}>
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep(2)} disabled={loading}>Back</button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className={styles.sidebar}>
          <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
            
            <div className={styles.summaryItems}>
              {cart.map(item => (
                <div key={item.product.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImage}>
                    <img src={item.product.images[0]} alt={item.product.name} />
                  </div>
                  <div className={styles.summaryItemInfo}>
                    <div className={styles.summaryItemName}>{item.product.name}</div>
                    <div className={styles.summaryItemQty}>Qty: {item.quantity}</div>
                  </div>
                  <div className={styles.summaryItemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="divider" style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-light)' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
