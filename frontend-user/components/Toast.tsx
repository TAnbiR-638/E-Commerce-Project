'use client';

import { useApp } from '@/context/AppContext';
import styles from './Toast.module.css';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className={`${styles.toast} ${styles[toast.type]} animate-fade-in-up`} role="alert">
      <span className={styles.icon}>{icons[toast.type]}</span>
      <span className={styles.message}>{toast.message}</span>
    </div>
  );
}
