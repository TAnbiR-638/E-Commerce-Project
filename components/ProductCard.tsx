'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ProductCard({ product, variant = 'default' }: Props) {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useApp();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', 'info');
  };

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className={`${styles.card} ${styles[variant]}`}
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className={styles.imageWrap}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 50vw, 25vw"
          className={styles.image}
        />

        {/* Badges */}
        <div className={styles.badgeGroup}>
          {product.isNew && <span className={`badge badge-accent ${styles.badge}`}>New</span>}
          {product.isBestSeller && <span className={`badge badge-primary ${styles.badge}`}>Best Seller</span>}
          {discountPct > 0 && <span className={`badge badge-error ${styles.badge}`}>-{discountPct}%</span>}
        </div>

        {/* Wishlist Button */}
        <button
          className={`${styles.wishlistBtn} ${inWishlist ? styles.active : ''}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-${product.id}`}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>

        {/* Quick Add Overlay */}
        <div className={styles.overlay}>
          <button
            className={`btn btn-primary btn-sm ${styles.addBtn}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            id={`add-to-cart-${product.id}`}
          >
            {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.brand}>{product.brand}</span>
          <span className={styles.category}>{product.category}</span>
        </div>

        <h3 className={styles.name}>{product.name}</h3>

        {/* Rating */}
        <div className={styles.rating}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={`star ${s > Math.round(product.rating) ? 'star-empty' : ''}`}>★</span>
            ))}
          </div>
          <span className={styles.ratingText}>
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock */}
        {product.stock < 10 && product.stock > 0 && (
          <span className={styles.lowStock}>⚠️ Only {product.stock} left</span>
        )}
        {product.stock === 0 && (
          <span className={styles.outOfStock}>❌ Out of Stock</span>
        )}
      </div>
    </Link>
  );
}
