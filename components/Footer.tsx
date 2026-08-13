import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span>⚡</span> Nova<strong>Shop</strong>
            </Link>
            <p className={styles.tagline}>
              Your premium destination for curated tech, fashion, and lifestyle products. Built with Next.js, Node.js, and PostgreSQL.
            </p>
            <div className={styles.socials}>
              {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map(s => (
                <a key={s} href="#" className={styles.social} aria-label={s}>{s[0]}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className={styles.linkGroup}>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/products?category=electronics">Electronics</Link></li>
              <li><Link href="/products?category=fashion">Fashion</Link></li>
              <li><Link href="/products?category=home-living">Home & Living</Link></li>
              <li><Link href="/products?filter=new">New Arrivals</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Account</h4>
            <ul>
              <li><Link href="/login">Sign In</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/orders">My Orders</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
              <li><Link href="/profile">Profile</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Company</h4>
            <ul>
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Tech Stack Banner */}
        <div className={styles.techBanner}>
          <span className={styles.techLabel}>Built with</span>
          {['Next.js 14', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Docker', 'JWT Auth'].map(t => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>© 2024 NovaShop. Built for demonstration — Full Stack Developer Portfolio.</p>
          <p className={styles.payIcons}>💳 Visa &nbsp; 💳 Mastercard &nbsp; 💰 Stripe &nbsp; 📱 bKash</p>
        </div>
      </div>
    </footer>
  );
}
