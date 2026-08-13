'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApp } from '@/context/AppContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/products?category=electronics', label: 'Electronics' },
  { href: '/products?category=fashion', label: 'Fashion' },
];

export default function Navbar() {
  const { cartCount, openCart, user, logout, wishlist } = useApp();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.inner}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <span className={styles.logoText}>
                Nova<span className={styles.logoBold}>Shop</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <ul className={styles.links}>
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.navLink}>{link.label}</Link>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className={styles.actions}>
              {/* Theme Toggle — Light / Dark / System */}
              {mounted && (
                <div className={styles.themeToggle} role="group" aria-label="Theme">
                  <button
                    className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
                    onClick={() => setTheme('light')}
                    aria-label="Light mode"
                    title="Light mode"
                    id="nav-theme-light"
                  >☀️</button>
                  <button
                    className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
                    onClick={() => setTheme('dark')}
                    aria-label="Dark mode"
                    title="Dark mode"
                    id="nav-theme-dark"
                  >🌙</button>
                  <button
                    className={`${styles.themeBtn} ${theme === 'system' ? styles.themeBtnActive : ''}`}
                    onClick={() => setTheme('system')}
                    aria-label="System mode"
                    title="Follow system"
                    id="nav-theme-system"
                  >💻</button>
                </div>
              )}

              {/* Search */}
              <button
                className={`btn btn-icon btn-ghost ${styles.actionBtn}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                id="nav-search-btn"
              >
                🔍
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={`btn btn-icon btn-ghost ${styles.actionBtn}`}
                aria-label="Wishlist"
                id="nav-wishlist-btn"
              >
                {wishlist.length > 0 ? '❤️' : '🤍'}
                {wishlist.length > 0 && (
                  <span className={styles.badge}>{wishlist.length}</span>
                )}
              </Link>

              {/* Cart */}
              <button
                className={`btn btn-icon btn-ghost ${styles.actionBtn} ${styles.cartBtn}`}
                onClick={openCart}
                aria-label="Open cart"
                id="nav-cart-btn"
              >
                🛒
                {cartCount > 0 && (
                  <span className={`${styles.badge} ${styles.cartBadge}`}>{cartCount}</span>
                )}
              </button>

              {/* User */}
              <div className={styles.userWrapper}>
                {user ? (
                  <div className={styles.userMenu}>
                    <button
                      className={styles.avatarBtn}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      id="nav-user-btn"
                    >
                      <span className="avatar">{user.name.slice(0, 2).toUpperCase()}</span>
                    </button>
                    {userMenuOpen && (
                      <div className={styles.dropdown}>
                        <div className={styles.dropdownHeader}>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                          {user.role === 'ADMIN' && <span className="badge badge-primary">Admin</span>}
                        </div>
                        <div className={styles.dropdownDivider} />
                        <Link href="/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>👤 Profile</Link>
                        <Link href="/orders" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>📦 My Orders</Link>
                        {user.role === 'ADMIN' && (
                          <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>📊 Dashboard</Link>
                        )}
                        <div className={styles.dropdownDivider} />
                        <button
                          className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          id="nav-logout-btn"
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className={`${styles.menuToggle} btn btn-icon btn-ghost`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                id="nav-menu-toggle"
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className={`${styles.searchBar} animate-fade-in-up`}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                className={styles.searchInput}
                id="nav-search-input"
              />
              {searchQuery && (
                <button className={styles.searchClear} onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={`${styles.mobileMenu} animate-fade-in-up`}>
            <div className="container">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className={styles.mobileAuth}>
                  <Link href="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link href="/register" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: 'var(--nav-height)' }} />
    </>
  );
}
