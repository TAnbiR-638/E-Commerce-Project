'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './admin-layout.module.css';

const NAV_LINKS = [
  { href: '/admin',           icon: '📊', label: 'Overview'  },
  { href: '/admin/products',  icon: '📦', label: 'Products'  },
  { href: '/admin/orders',    icon: '🛍️', label: 'Orders'    },
  { href: '/admin/customers', icon: '👥', label: 'Customers' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useApp();

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span>Nova<strong>Admin</strong></span>
        </div>

        <nav className={styles.nav}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminUser}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
              {user?.name?.slice(0, 2).toUpperCase() ?? 'AD'}
            </div>
            <div className={styles.adminUserInfo}>
              <span className={styles.adminName}>{user?.name ?? 'Admin'}</span>
              <span className={styles.adminRole}>Administrator</span>
            </div>
          </div>
          <div className={styles.sidebarActions}>
            <Link href="/" className={styles.sidebarAction} title="View Store">🏪</Link>
            <button onClick={logout} className={styles.sidebarAction} title="Logout">🚪</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>
            {NAV_LINKS.find(l => l.href === pathname)?.label ?? 'Dashboard'}
          </div>
          <div className={styles.topbarRight}>
            <span className="badge badge-success">● Live</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
