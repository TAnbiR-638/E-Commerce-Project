'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';
  const { dispatch, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Block admin emails from user login
      if (email.toLowerCase().startsWith('admin')) {
        setError('Admin accounts must log in at the Admin Portal.');
        return;
      }

      const user = {
        id: 'u1',
        name: email.split('@')[0],
        email,
        role: 'USER' as const,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'SET_USER', payload: user as any });
      localStorage.setItem('user', JSON.stringify(user));

      // Write cookies for middleware
      document.cookie = `auth_token=mock_user_token; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `user_role=USER; path=/; max-age=${60 * 60 * 24 * 7}`;

      showToast(`Welcome back, ${user.name}!`, 'success');
      router.push(redirectTo);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg-base)' }}>
      <div className="glass-card animate-fade-in-up" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛍️</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your NovaShop account</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.88rem', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" required className="input" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="input-label">Password</label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Forgot Password?</a>
            </div>
            <input type="password" required className="input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one</Link>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link href="/admin/login" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔐 Admin Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
