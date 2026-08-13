import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with all categories and products...\n');

  // ── Users ──────────────────────────────────────────────────────
  const adminPwd = await bcrypt.hash('Admin@1234', 12);
  const userPwd  = await bcrypt.hash('User@1234', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@novashop.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@novashop.com', password: adminPwd, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'demo@novashop.com' },
    update: {},
    create: { name: 'Demo Customer', email: 'demo@novashop.com', password: userPwd, role: 'USER' },
  });

  console.log('✅ Users seeded');

  // ── Categories ────────────────────────────────────────────────
  const categorySeedData = [
    { name: 'Electronics',    slug: 'electronics',    description: 'Gadgets, computers, phones & audio' },
    { name: 'Fashion',        slug: 'fashion',        description: 'Clothing, shoes & accessories' },
    { name: 'Home & Living',  slug: 'home-living',    description: 'Furniture, appliances & kitchen' },
    { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Equipment, wearables & gear' },
    { name: 'Outdoor',        slug: 'outdoor',        description: 'Camping, grilling & adventure' },
    { name: 'Beauty',         slug: 'beauty',         description: 'Skincare, haircare & wellness' },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categorySeedData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categories[cat.slug] = c.id;
  }

  console.log('✅ Categories seeded:', Object.keys(categories).join(', '));

  // ── Products ──────────────────────────────────────────────────
  const products = [
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life with quick charging. Multipoint connection for two devices simultaneously.',
      price: 279.99, originalPrice: 399.99, discount: 30,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
      categorySlug: 'electronics', brand: 'Sony',
      rating: 4.8, reviewCount: 2847, stock: 48, sku: 'SNY-WH1000XM5-BLK',
      tags: ['wireless', 'noise-canceling', 'premium', 'audio'],
      isFeatured: true, isBestSeller: true, isNew: false, isVisible: true,
      specifications: { 'Driver Unit': '30mm dome type', 'Frequency Response': '4Hz–40,000Hz', 'Battery Life': '30 hours', 'Charging Time': '3.5 hours', 'Weight': '250g', 'Connectivity': 'Bluetooth 5.2' },
    },
    {
      name: 'MacBook Pro 16" M3 Pro Chip',
      slug: 'macbook-pro-16-m3',
      description: 'Supercharged by M3 Pro, MacBook Pro takes performance to the next level. With an immersive Liquid Retina XDR display and all-day battery life.',
      price: 1999.99, originalPrice: 2499.99, discount: 20,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 'https://images.unsplash.com/photo-1611186871525-b5a4fc3ec5a6?w=800&q=80'],
      categorySlug: 'electronics', brand: 'Apple',
      rating: 4.9, reviewCount: 1283, stock: 12, sku: 'AAPL-MBP16-M3PRO',
      tags: ['laptop', 'apple', 'pro', 'M3'],
      isFeatured: true, isBestSeller: false, isNew: true, isVisible: true,
      specifications: { 'Chip': 'Apple M3 Pro', 'Memory': '36GB', 'Storage': '512GB SSD', 'Display': '16.2" Liquid Retina XDR', 'Battery': 'Up to 22 hours', 'Weight': '2.14 kg' },
    },
    {
      name: 'Nike Air Jordan 1 Retro High OG',
      slug: 'nike-air-jordan-1-retro',
      description: 'The shoes that started it all. Premium leather upper with foam midsole for lightweight cushioning. An icon of basketball culture.',
      price: 180.00, originalPrice: 180.00, discount: null,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80'],
      categorySlug: 'fashion', brand: 'Nike',
      rating: 4.7, reviewCount: 4521, stock: 34, sku: 'NK-AJ1-RETRO-HI',
      tags: ['sneakers', 'basketball', 'retro', 'iconic'],
      isFeatured: true, isBestSeller: true, isNew: false, isVisible: true,
      specifications: { 'Upper': 'Full-grain leather', 'Midsole': 'Foam', 'Outsole': 'Rubber', 'Closure': 'Lace-up' },
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'The most powerful Galaxy ever with built-in S Pen. 200MP camera with AI-powered features and 12GB RAM for seamless performance.',
      price: 1299.99, originalPrice: 1399.99, discount: 7,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
      categorySlug: 'electronics', brand: 'Samsung',
      rating: 4.6, reviewCount: 3102, stock: 67, sku: 'SAM-S24-ULTRA-256',
      tags: ['smartphone', 'android', 'flagship', 'camera'],
      isFeatured: true, isBestSeller: false, isNew: true, isVisible: true,
      specifications: { 'Display': '6.8" QHD+ AMOLED', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '256GB', 'Battery': '5000mAh' },
    },
    {
      name: 'Dyson V15 Detect Cordless Vacuum',
      slug: 'dyson-v15-detect',
      description: "Dyson's most powerful cordless vacuum with laser to reveal hidden dust. Counts and sizes microscopic particles. Up to 60 minutes run time.",
      price: 549.99, originalPrice: 699.99, discount: 21,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
      categorySlug: 'home-living', brand: 'Dyson',
      rating: 4.5, reviewCount: 892, stock: 23, sku: 'DYS-V15-DETECT',
      tags: ['vacuum', 'cordless', 'home', 'cleaning'],
      isFeatured: false, isBestSeller: false, isNew: false, isVisible: true,
      specifications: { 'Motor': 'Dyson Hyperdymium', 'Suction': 'Up to 230 AW', 'Run time': 'Up to 60 min', 'Weight': '3.1 kg', 'Filtration': 'HEPA' },
    },
    {
      name: "Levi's 501 Original Fit Jeans",
      slug: 'levis-501-original-jeans',
      description: 'The original jeans. 100% cotton denim with button fly closure and straight leg cut. A timeless American icon.',
      price: 69.50, originalPrice: 89.50, discount: 22,
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80'],
      categorySlug: 'fashion', brand: "Levi's",
      rating: 4.4, reviewCount: 6741, stock: 120, sku: 'LVS-501-ORIG',
      tags: ['jeans', 'denim', 'classic', 'casual'],
      isFeatured: false, isBestSeller: true, isNew: false, isVisible: true,
      specifications: { 'Material': '100% Cotton', 'Fit': 'Original', 'Rise': 'Regular', 'Closure': 'Button fly' },
    },
    {
      name: 'Instant Pot Pro 10-in-1 Pressure Cooker',
      slug: 'instant-pot-pro-10in1',
      description: 'Your all-in-one multicooker for pressure cooking, slow cooking, rice, steaming, sautéing and more. 28 pre-set programs.',
      price: 99.95, originalPrice: 149.95, discount: 33,
      images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80'],
      categorySlug: 'home-living', brand: 'Instant Pot',
      rating: 4.6, reviewCount: 11234, stock: 85, sku: 'IP-PRO-10IN1-6QT',
      tags: ['kitchen', 'pressure cooker', 'multi-cooker', 'cooking'],
      isFeatured: false, isBestSeller: true, isNew: false, isVisible: true,
      specifications: { 'Capacity': '6 Quart', 'Programs': '28', 'Functions': '10-in-1', 'Power': '1000W' },
    },
    {
      name: 'Kindle Paperwhite Signature Edition',
      slug: 'kindle-paperwhite-signature',
      description: '6.8" display with adjustable warm light and 32GB storage. Waterproof with wireless charging for up to 10 weeks of battery.',
      price: 139.99, originalPrice: 189.99, discount: 26,
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'],
      categorySlug: 'electronics', brand: 'Amazon',
      rating: 4.7, reviewCount: 5632, stock: 44, sku: 'AMZ-KPW-SIG-32GB',
      tags: ['kindle', 'ebook', 'reading', 'waterproof'],
      isFeatured: false, isBestSeller: false, isNew: true, isVisible: true,
      specifications: { 'Display': '6.8" 300 PPI', 'Storage': '32GB', 'Battery': '10 weeks', 'Waterproof': 'IPX8', 'Charging': 'Wireless' },
    },
    {
      name: 'Weber Spirit II E-310 Gas Grill',
      slug: 'weber-spirit-ii-e310',
      description: 'GS4 grilling system with infinity ignition and porcelain-enameled cast-iron cooking grates. 3 stainless steel burners.',
      price: 499.00, originalPrice: 629.00, discount: 21,
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'],
      categorySlug: 'outdoor', brand: 'Weber',
      rating: 4.5, reviewCount: 1847, stock: 18, sku: 'WBR-SPIRIT2-E310',
      tags: ['grill', 'outdoor', 'bbq', 'cooking'],
      isFeatured: false, isBestSeller: false, isNew: false, isVisible: true,
      specifications: { 'Burners': '3 stainless steel', 'Cooking area': '529 sq in', 'BTU': '30,000 BTU/hr', 'Fuel': 'Liquid propane' },
    },
    {
      name: 'Fitbit Charge 6 Fitness Tracker',
      slug: 'fitbit-charge-6',
      description: 'Track your health 24/7 with built-in GPS, heart rate monitoring, sleep tracking, and Google services. 7-day battery.',
      price: 159.95, originalPrice: 179.95, discount: 11,
      images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'],
      categorySlug: 'sports-fitness', brand: 'Fitbit',
      rating: 4.3, reviewCount: 2193, stock: 91, sku: 'FTB-CHRG6-BLK',
      tags: ['fitness', 'tracker', 'health', 'wearable'],
      isFeatured: false, isBestSeller: false, isNew: true, isVisible: true,
      specifications: { 'GPS': 'Built-in', 'Heart Rate': '24/7', 'Battery': '7 days', 'Water resistance': '50m' },
    },
    {
      name: 'IKEA POÄNG Armchair',
      slug: 'ikea-poang-armchair',
      description: 'Timeless design with layer-glued bent birch frame for resilience. Cushioned seat and back. Max load 110 kg.',
      price: 149.00, originalPrice: 149.00, discount: null,
      images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80'],
      categorySlug: 'home-living', brand: 'IKEA',
      rating: 4.2, reviewCount: 8934, stock: 67, sku: 'IKEA-POANG-BIRCH',
      tags: ['chair', 'furniture', 'living room', 'comfort'],
      isFeatured: false, isBestSeller: true, isNew: false, isVisible: true,
      specifications: { 'Material': 'Birch veneer, cotton', 'Width': '68 cm', 'Depth': '82 cm', 'Height': '100 cm', 'Max load': '110 kg' },
    },
    {
      name: 'GoPro HERO12 Black Action Camera',
      slug: 'gopro-hero12-black',
      description: 'Capture adventures in stunning 5.3K video. HyperSmooth 6.0 stabilization, 27MP photos, up to 70 min battery, waterproof to 10m.',
      price: 349.99, originalPrice: 399.99, discount: 13,
      images: ['https://images.unsplash.com/photo-1544280145-667793d40dae?w=800&q=80'],
      categorySlug: 'electronics', brand: 'GoPro',
      rating: 4.6, reviewCount: 1567, stock: 29, sku: 'GPR-HERO12-BLK',
      tags: ['camera', 'action', 'waterproof', 'adventure'],
      isFeatured: false, isBestSeller: false, isNew: true, isVisible: true,
      specifications: { 'Video': '5.3K60 + 4K120', 'Photo': '27MP', 'Stabilization': 'HyperSmooth 6.0', 'Waterproof': '10m' },
    },
  ];

  let seeded = 0;
  for (const p of products) {
    const { categorySlug, ...rest } = p;
    const categoryId = categories[categorySlug];
    if (!categoryId) { console.warn(`⚠️  Category not found: ${categorySlug}`); continue; }

    await prisma.product.upsert({
      where: { slug: rest.slug },
      update: { ...rest, categoryId },
      create: { ...rest, categoryId },
    });
    seeded++;
  }

  console.log(`✅ ${seeded} products seeded\n`);
  console.log('─────────────────────────────────────────────');
  console.log('🎉 Seed complete!\n');
  console.log('  Admin:    admin@novashop.com / Admin@1234');
  console.log('  Customer: demo@novashop.com  / User@1234');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
