'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import styles from '../page.module.css';
import modalStyles from './products.module.css';

interface Product {
  id: string; name: string; slug: string; brand: string;
  price: number; originalPrice?: number; discount?: number;
  stock: number; images: string[]; isFeatured: boolean; isBestSeller: boolean;
  isNew: boolean; isVisible: boolean; sku?: string; rating: number;
  reviewCount: number; category: { id: string; name: string; slug: string };
  categoryId: string; description: string; tags: string[];
}

const EMPTY_FORM: Partial<Product> & { categoryId: string } = {
  name: '', slug: '', brand: '', price: 0, originalPrice: undefined,
  discount: undefined, stock: 0, images: [], isFeatured: false,
  isBestSeller: false, isNew: false, isVisible: true, sku: '',
  rating: 0, reviewCount: 0, categoryId: '', description: '', tags: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [imageInput, setImageInput] = useState('');

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll({ visible: 'all', limit: '100' }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${document.cookie.match(/auth_token=([^;]+)/)?.[1] || ''}` },
        }).then(r => r.json()),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data || []);
    } catch {
      // fallback to mock
      const { MOCK_PRODUCTS } = await import('@/lib/data');
      setProducts(MOCK_PRODUCTS as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ ...EMPTY_FORM });
    setImageInput('');
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ ...product, categoryId: product.categoryId || product.category?.id });
    setImageInput('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, form);
        showToast('Product updated!', true);
      } else {
        await productsApi.create(form);
        showToast('Product created!', true);
      }
      setShowModal(false);
      fetchData();
    } catch (e: any) {
      showToast(e.message || 'Failed to save product', false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productsApi.delete(id);
      showToast('Product deleted', true);
      fetchData();
    } catch (e: any) {
      showToast(e.message || 'Delete failed', false);
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      await productsApi.toggleVisibility(product.id, !product.isVisible);
      showToast(product.isVisible ? 'Hidden from store' : 'Now visible in store', true);
      fetchData();
    } catch {
      showToast('Update failed', false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm((f: any) => ({ ...f, images: [...(f.images || []), imageInput.trim()] }));
      setImageInput('');
    }
  };

  const removeImage = (idx: number) => {
    setForm((f: any) => ({ ...f, images: f.images.filter((_: any, i: number) => i !== idx) }));
  };

  return (
    <div>
      {/* Header */}
      <div className={modalStyles.pageHeader}>
        <div>
          <h1 className={modalStyles.pageTitle}>Products</h1>
          <p className={modalStyles.pageSubtitle}>{products.length} total · {filtered.length} shown</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`${modalStyles.toast} ${toast.ok ? modalStyles.toastOk : modalStyles.toastErr}`}>
          {toast.ok ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Search */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px', maxWidth: 400 }}>
          <input type="text" className="input" placeholder="🔍 Search by name, brand or SKU..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className={modalStyles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={`${modalStyles.skeleton} glass-card`} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table} style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Visible</th>
                  <th>Badges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
                          {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="48px" />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--text-primary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{p.brand} {p.sku ? `· ${p.sku}` : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{p.category?.name || '—'}</span></td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(p.price)}</div>
                      {p.discount && <div style={{ fontSize: '0.73rem', color: 'var(--success)' }}>-{p.discount}% off</div>}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--error)' : p.stock < 20 ? 'var(--warning)' : 'var(--success)' }}>
                        {p.stock === 0 ? 'OUT' : p.stock}
                      </span>
                    </td>
                    <td>⭐ {p.rating} <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>({p.reviewCount})</span></td>
                    <td>
                      <button
                        onClick={() => handleToggleVisibility(p)}
                        className={`${modalStyles.visToggle} ${p.isVisible ? modalStyles.visOn : modalStyles.visOff}`}
                        title={p.isVisible ? 'Visible — click to hide' : 'Hidden — click to show'}
                      >
                        {p.isVisible ? '👁 On' : '🚫 Off'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.isFeatured && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>★ Featured</span>}
                        {p.isBestSeller && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>🔥 Best</span>}
                        {p.isNew && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>✨ New</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(p.id, p.name)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                No products found for "{search}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={modalStyles.overlay} onClick={() => setShowModal(false)}>
          <div className={modalStyles.modal} onClick={e => e.stopPropagation()}>
            <div className={modalStyles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className={modalStyles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className={modalStyles.modalBody}>
              <div className={modalStyles.grid2}>
                <div className="input-group">
                  <label className="input-label">Product Name *</label>
                  <input className="input" value={form.name || ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Brand *</label>
                  <input className="input" value={form.brand || ''} onChange={e => setForm((f: any) => ({ ...f, brand: e.target.value }))} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input" rows={3} style={{ resize: 'vertical' }}
                  value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
              </div>

              <div className={modalStyles.grid3}>
                <div className="input-group">
                  <label className="input-label">Price ($) *</label>
                  <input className="input" type="number" step="0.01" value={form.price || ''} onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Original Price ($)</label>
                  <input className="input" type="number" step="0.01" value={form.originalPrice || ''} onChange={e => setForm((f: any) => ({ ...f, originalPrice: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Discount (%)</label>
                  <input className="input" type="number" min="0" max="100" value={form.discount || ''} onChange={e => setForm((f: any) => ({ ...f, discount: e.target.value }))} />
                </div>
              </div>

              <div className={modalStyles.grid3}>
                <div className="input-group">
                  <label className="input-label">Stock *</label>
                  <input className="input" type="number" value={form.stock || 0} onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">SKU</label>
                  <input className="input" value={form.sku || ''} onChange={e => setForm((f: any) => ({ ...f, sku: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Category *</label>
                  <select className="input" value={form.categoryId || ''} onChange={e => setForm((f: any) => ({ ...f, categoryId: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Images */}
              <div className="input-group">
                <label className="input-label">Product Images (URLs)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input" placeholder="https://..." value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} />
                  <button type="button" className="btn btn-secondary" onClick={addImage}>Add</button>
                </div>
                {form.images?.length > 0 && (
                  <div className={modalStyles.imageGrid}>
                    {form.images.map((url: string, i: number) => (
                      <div key={i} className={modalStyles.imageItem}>
                        <img src={url} alt="" className={modalStyles.imagePreview} />
                        <button className={modalStyles.imageRemove} onClick={() => removeImage(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className={modalStyles.toggleGrid}>
                {[
                  { key: 'isVisible', label: '👁 Visible in Store' },
                  { key: 'isFeatured', label: '★ Featured' },
                  { key: 'isBestSeller', label: '🔥 Best Seller' },
                  { key: 'isNew', label: '✨ New Arrival' },
                ].map(({ key, label }) => (
                  <label key={key} className={modalStyles.toggleLabel}>
                    <div className={`${modalStyles.toggle} ${form[key] ? modalStyles.toggleActive : ''}`}
                      onClick={() => setForm((f: any) => ({ ...f, [key]: !f[key] }))}>
                      <div className={modalStyles.toggleThumb} />
                    </div>
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className={modalStyles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
