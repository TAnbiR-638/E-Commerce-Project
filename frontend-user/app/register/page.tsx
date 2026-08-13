'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { dispatch, showToast } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register(formData.name, formData.email, formData.password);
      const user = res.user;
      dispatch({ type: 'SET_USER', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
      // Set auth cookies
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `auth_token=${res.token}; path=/; max-age=${maxAge}`;
      document.cookie = `user_role=${user.role}; path=/; max-age=${maxAge}`;
      showToast('Account created! Welcome to NovaShop 🎉', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg-base)' }}>
      <div className="glass-card animate-fade-in-up" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✨</div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join 50,000+ NovaShop customers</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.88rem', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input type="text" name="name" required className="input" placeholder="John Doe"
              value={formData.name} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" name="email" required className="input" placeholder="you@example.com"
              value={formData.email} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                required 
                className="input" 
                placeholder="Min 8 characters"
                value={formData.password} 
                onChange={handleChange} 
                minLength={8} 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirm ? "text" : "password"} 
                name="confirm" 
                required 
                className="input" 
                placeholder="••••••••"
                value={formData.confirm} 
                onChange={handleChange} 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px'
                }}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up for Free'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
