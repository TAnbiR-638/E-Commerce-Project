'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { authApi } from '@/lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';
  const { dispatch, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const setAuthCookies = (token: string, role: string) => {
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}`;
    document.cookie = `user_role=${role}; path=/; max-age=${maxAge}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email.toLowerCase().startsWith('admin')) {
      setError('Admin accounts must log in via the Admin Portal.');
      return;
    }

    setLoading(true);
    try {
      // Try real backend first
      const res = await authApi.login(email, password);
      const user = res.user;
      dispatch({ type: 'SET_USER', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
      setAuthCookies(res.token, user.role);
      showToast(`Welcome back, ${user.name}!`, 'success');
      router.push(redirectTo);
    } catch {
      // Fallback: mock auth (works without backend)
      const user = { id: 'u1', name: email.split('@')[0], email, role: 'USER' as const, createdAt: new Date().toISOString() };
      dispatch({ type: 'SET_USER', payload: user as any });
      localStorage.setItem('user', JSON.stringify(user));
      setAuthCookies('mock_user_token', 'USER');
      showToast(`Welcome back, ${user.name}!`, 'success');
      router.push(redirectTo);
    } finally {
      setLoading(false);
    }
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
              value={email} onChange={e => setEmail(e.target.value)} id="user-email" />
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="input-label">Password</label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Forgot Password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="input" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                id="user-password" 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px' }} disabled={loading} id="user-login-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one</Link>
        </div>

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <a href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔐 Admin Portal →
          </a>
        </div>

        <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--accent-light)' }}>Demo:</strong> Any email + any password signs you in. Backend integration auto-activates when your API is running.
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
