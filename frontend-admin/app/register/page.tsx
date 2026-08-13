'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { authApi } from '@/lib/api';
import styles from '../login/admin-login.module.css';

export default function AdminRegisterPage() {
  const router = useRouter();
  const { dispatch, showToast } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', inviteCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setAuthCookies = (token: string) => {
    const maxAge = 60 * 60 * 8; // 8 hours
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;
    document.cookie = `user_role=ADMIN; path=/; max-age=${maxAge}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.adminRegister(
        formData.name,
        formData.email,
        formData.password,
        formData.inviteCode
      );
      dispatch({ type: 'SET_USER', payload: res.user });
      localStorage.setItem('user', JSON.stringify(res.user));
      setAuthCookies(res.token);
      showToast(`Admin account created. Welcome, ${res.user.name}!`, 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your invite code.');
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
          <h1 className={styles.title}>Create Admin Account</h1>
          <p className={styles.subtitle}>Restricted — requires an invite code</p>
          <div className={styles.warningBadge}>🔒 Admin Registration</div>
        </div>

        {error && <div className={styles.errorBox}>⛔ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className={`input ${styles.input}`}
              placeholder="Admin Name"
              value={formData.name}
              onChange={handleChange}
              id="admin-reg-name"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Admin Email</label>
            <input
              type="email"
              name="email"
              required
              className={`input ${styles.input}`}
              placeholder="admin@novashop.com"
              value={formData.email}
              onChange={handleChange}
              id="admin-reg-email"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className={`input ${styles.input}`}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                style={{ paddingRight: '40px' }}
                id="admin-reg-password"
              />
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
          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              required
              className={`input ${styles.input}`}
              placeholder="••••••••"
              value={formData.confirm}
              onChange={handleChange}
              id="admin-reg-confirm"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Admin Invite Code</label>
            <input
              type="password"
              name="inviteCode"
              required
              className={`input ${styles.input}`}
              placeholder="Enter invite code"
              value={formData.inviteCode}
              onChange={handleChange}
              id="admin-reg-invite"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Contact your system administrator for the invite code.
            </p>
          </div>
          <button
            type="submit"
            className={`btn btn-lg ${styles.submitBtn}`}
            disabled={loading}
            id="admin-reg-btn"
          >
            {loading ? '⏳ Creating account...' : '🛡️ Create Admin Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <a
            href={process.env.NEXT_PUBLIC_USER_URL || 'http://localhost:3000'}
            className={styles.userLink}
          >
            ← Back to Customer Store
          </a>
          <div className={styles.demoTip}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
