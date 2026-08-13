'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { authApi } from '@/lib/api';
import styles from './admin-login.module.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';
  const { dispatch, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const setAuthCookies = (token: string) => {
    const maxAge = 60 * 60 * 8; // 8 hours
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;
    document.cookie = `user_role=ADMIN; path=/; max-age=${maxAge}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.user.role !== 'ADMIN') {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      dispatch({ type: 'SET_USER', payload: res.user });
      localStorage.setItem('user', JSON.stringify(res.user));
      setAuthCookies(res.token);
      showToast(`Admin access granted. Welcome, ${res.user.name}!`, 'success');
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glowRed} />
      <div className={styles.glowAmber} />

      <div className={`glass-card animate-fade-in-up ${styles.card}`}>
        <div className={styles.header}>
          <div className={styles.shieldIcon}>🛡️</div>
          <h1 className={styles.title}>Admin Portal</h1>
          <p className={styles.subtitle}>Restricted access — authorized personnel only</p>
          <div className={styles.warningBadge}>🔒 Secure Administrative Login</div>
        </div>

        {error && <div className={styles.errorBox}>⛔ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label className="input-label">Admin Email</label>
            <input type="email" required className={`input ${styles.input}`}
              placeholder="admin@novashop.com" value={email}
              onChange={e => setEmail(e.target.value)} id="admin-email" />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} required className={`input ${styles.input}`}
                placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} id="admin-password"
                style={{ paddingRight: '40px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  fontSize: '1.2rem', display: 'flex', alignItems: 'center', padding: '4px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <button type="submit" className={`btn btn-lg ${styles.submitBtn}`}
            disabled={loading} id="admin-login-btn">
            {loading ? '⏳ Verifying...' : '🔐 Sign In to Admin'}
          </button>
        </form>

        <div className={styles.footer}>
          <a href={process.env.NEXT_PUBLIC_USER_URL || 'http://localhost:3000'}
            className={styles.userLink}>← Back to Customer Store</a>
          <div className={styles.demoTip}>
            <strong>Note:</strong> Only accounts with <code>ADMIN</code> role can access this panel.
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create Admin Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
