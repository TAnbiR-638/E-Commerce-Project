'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './admin-login.module.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/admin';
  const { dispatch, showToast } = useApp();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Only allow admin emails
      if (!email.toLowerCase().startsWith('admin')) {
        setError('Access denied. Only administrator accounts can log in here.');
        return;
      }

      const user = {
        id: 'admin_1',
        name: email.split('@')[0],
        email,
        role: 'ADMIN' as const,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'SET_USER', payload: user as any });
      localStorage.setItem('user', JSON.stringify(user));

      // Write cookies — role=ADMIN lets middleware grant access to /admin/*
      document.cookie = `auth_token=mock_admin_token; path=/; max-age=${60 * 60 * 8}`;
      document.cookie = `user_role=ADMIN; path=/; max-age=${60 * 60 * 8}`;

      showToast(`Admin access granted. Welcome, ${user.name}!`, 'success');
      router.push(redirectTo);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      {/* Background glow */}
      <div className={styles.glowRed} />
      <div className={styles.glowAmber} />

      <div className={`glass-card animate-fade-in-up ${styles.card}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.shieldIcon}>🛡️</div>
          <h1 className={styles.title}>Admin Portal</h1>
          <p className={styles.subtitle}>Restricted access — authorized personnel only</p>
          <div className={styles.warningBadge}>
            🔒 Secure Administrative Login
          </div>
        </div>

        {error && (
          <div className={styles.errorBox}>
            ⛔ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label className="input-label">Admin Email</label>
            <input
              type="email"
              required
              className={`input ${styles.input}`}
              placeholder="admin@novashop.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              id="admin-email"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              required
              className={`input ${styles.input}`}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              id="admin-password"
            />
          </div>

          <button
            type="submit"
            className={`btn btn-lg ${styles.submitBtn}`}
            disabled={loading}
            id="admin-login-btn"
          >
            {loading ? '⏳ Verifying...' : '🔐 Sign In to Admin'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/login" className={styles.userLink}>
            ← Back to Customer Login
          </Link>
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
