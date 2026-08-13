'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    productsApi.getById(id)
      .then(res => {
        setProduct(res.data);
        setMainImage(res.data.images[0]);
      })
      .catch(err => {
        console.error('Failed to load product:', err);
        setError('Product not found or failed to load.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', display: 'flex', gap: '40px' }}>
        <div style={{ flex: '1', height: '500px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ height: '40px', width: '80%', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '24px', width: '40%', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '200px', width: '100%', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite', marginTop: '20px' }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center', minHeight: '70vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</h1>
        <h2>{error || 'Product not found'}</h2>
        <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ marginTop: '24px' }}>
          Back to Products
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPct = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  
  const handleAddToCart = () => {
    addToCart(product, qty);
    showToast(`Added ${qty} ${qty > 1 ? 'items' : 'item'} to cart!`, 'success');
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 'info');
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <span style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => router.push('/')}>Home</span>
        {' / '}
        <span style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => router.push('/products')}>Products</span>
        {' / '}
        <span style={{ color: 'var(--primary-light)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
        
        {/* Left: Images Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '100px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {mainImage && (
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                style={{ objectFit: 'cover' }} 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
            {/* Badges Overlay */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {product.isNew && <span className="badge badge-accent">New Arrival</span>}
              {product.isBestSeller && <span className="badge badge-primary">Best Seller</span>}
            </div>
            {discountPct > 0 && (
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <span className="badge badge-error">-{discountPct}% OFF</span>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  style={{ 
                    position: 'relative', width: '80px', height: '80px', flexShrink: 0,
                    borderRadius: 'var(--radius-md)', overflow: 'hidden', 
                    border: mainImage === img ? '2px solid var(--primary)' : '2px solid transparent',
                    cursor: 'pointer', transition: 'var(--transition-fast)'
                  }}
                >
                  <Image src={img} alt={`Thumbnail ${idx+1}`} fill style={{ objectFit: 'cover' }} sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <h1 style={{ fontSize: '2.4rem', lineHeight: '1.2', marginBottom: '8px' }}>{product.name}</h1>
              <button 
                onClick={handleWishlist}
                className="btn btn-icon btn-ghost"
                style={{ fontSize: '1.5rem', background: 'var(--bg-elevated)', borderRadius: '50%', padding: '12px', flexShrink: 0 }}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="stars" style={{ display: 'flex', gap: '2px', color: 'var(--warning)', fontSize: '1.1rem' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ opacity: s > Math.round(product.rating) ? 0.3 : 1 }}>★</span>
                ))}
              </div>
              <span style={{ color: 'var(--text-muted)' }}>{product.rating} ({product.reviewCount} reviews)</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Brand: {product.brand}</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ color: 'var(--text-secondary)' }}>SKU: {product.sku}</span>
            </div>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              {product.stock > 10 ? (
                <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span> In Stock
                </span>
              ) : product.stock > 0 ? (
                <span style={{ color: 'var(--warning)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }}></span> Low Stock: Only {product.stock} left!
                </span>
              ) : (
                <span style={{ color: 'var(--error)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)' }}></span> Out of Stock
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ padding: '12px 16px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
                  disabled={qty <= 1}
                >−</button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  style={{ padding: '12px 16px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
                  disabled={qty >= product.stock}
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '1.1rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                🛒 {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
              {product.description}
            </p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Specifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ width: '40%', color: 'var(--text-muted)', fontWeight: 500 }}>{key}</span>
                    <span style={{ width: '60%', color: 'var(--text-primary)', fontWeight: 600 }}>{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.tags.map(tag => (
                <span key={tag} style={{ padding: '6px 12px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
