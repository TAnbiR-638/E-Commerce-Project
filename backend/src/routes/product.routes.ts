import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { cacheResponse, invalidateCache } from '../middleware/cache.middleware';

const router = Router();
const prisma = new PrismaClient();

// ── GET /api/v1/products  (public, supports ?category=&search=&sort=&page=&limit=) ──
router.get('/', cacheResponse(300), async (req: Request, res: Response) => {
  try {
    const { category, search, sort, page = '1', limit = '12', featured, visible = 'true' } = req.query;

    const where: any = {};

    // Only show visible products to public (admins can override)
    if (visible !== 'all') where.isVisible = true;
    if (category) where.category = { slug: category };
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { brand: { contains: String(search), mode: 'insensitive' } },
        { tags: { hasSome: [String(search).toLowerCase()] } },
      ];
    }

    const orderBy: any =
      sort === 'price-asc'   ? { price: 'asc' }  :
      sort === 'price-desc'  ? { price: 'desc' } :
      sort === 'rating'      ? { rating: 'desc' } :
      sort === 'newest'      ? { createdAt: 'desc' } :
      sort === 'popular'     ? { reviewCount: 'desc' } :
                               { createdAt: 'desc' };

    const pageNum  = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(50, parseInt(String(limit)));

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ success: true, data, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/v1/products/:id ──────────────────────────────────────────────────
router.get('/:id', cacheResponse(300), async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/v1/products  (admin only) ──────────────────────────────────────
router.post('/', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const {
      name, slug, description, price, originalPrice, discount,
      stock, images, brand, categoryId, isFeatured, isBestSeller,
      isNew, isVisible, sku, tags, rating, reviewCount, specifications,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name, slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        description, price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discount: discount ? parseInt(discount) : null,
        stock: parseInt(stock) || 0,
        images: images || [],
        brand, categoryId,
        isFeatured: !!isFeatured,
        isBestSeller: !!isBestSeller,
        isNew: !!isNew,
        isVisible: isVisible !== false,
        sku: sku || null,
        tags: tags || [],
        rating: rating ? parseFloat(rating) : 0,
        reviewCount: reviewCount ? parseInt(reviewCount) : 0,
        specifications: specifications || null,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    
    await invalidateCache('/api/v1/products*');
    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Slug or SKU already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/v1/products/:id  (admin only) ───────────────────────────────────
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    if (data.price) data.price = parseFloat(data.price);
    if (data.originalPrice) data.originalPrice = parseFloat(data.originalPrice);
    if (data.stock !== undefined) data.stock = parseInt(data.stock);
    if (data.discount !== undefined) data.discount = data.discount ? parseInt(data.discount) : null;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    
    await invalidateCache('/api/v1/products*');
    res.json({ success: true, data: product });
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/v1/products/:id/visibility  (admin only) ─────────────────────
router.patch('/:id/visibility', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { isVisible: req.body.isVisible },
    });
    
    await invalidateCache('/api/v1/products*');
    res.json({ success: true, data: { id: product.id, isVisible: product.isVisible } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/v1/products/:id  (admin only) ────────────────────────────────
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    
    await invalidateCache('/api/v1/products*');
    res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
