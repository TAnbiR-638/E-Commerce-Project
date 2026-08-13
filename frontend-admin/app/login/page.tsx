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

  const setAuthCookies = (token: string) => {
    const maxAge = 60 * 60 * 8; // 8 hours
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;
    document.cookie = `user_role=ADMIN; path=/; max-age=${maxAge}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().startsWith('admin')) {
      setError('Access denied. Only administrator accounts are permitted here.');
      return;
    }

    setLoading(true);
    try {
      // Try real backend first
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
    } catch {
      // Fallback mock auth
      const user = { id: 'admin_1', name: email.split('@')[0], email, role: 'ADMIN' as const, createdAt: new Date().toISOString() };
      dispatch({ type: 'SET_USER', payload: user as any });
      localStorage.setItem('user', JSON.stringify(user));
      setAuthCookies('mock_admin_token');
      showToast(`Admin access granted. Welcome, ${user.name}!`, 'success');
      router.push(redirectTo);
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
            <input type="password" required className={`input ${styles.input}`}
              placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} id="admin-password" />
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
            <strong>Demo:</strong> Use any email starting with <code>admin@</code>
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
