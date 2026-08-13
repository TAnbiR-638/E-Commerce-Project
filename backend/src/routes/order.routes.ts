import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// POST /api/v1/orders  (authenticated user)
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'No items provided' });

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let total = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const price = product.price * item.quantity;
      total += price;
      return { productId: item.productId, quantity: item.quantity, price: product.price };
    });

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        total,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/orders/my  (authenticated user's own orders)
router.get('/my', authenticate, async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: { select: { id: true, name: true, images: true, price: true } } } } },
    });
    res.json({ success: true, data: orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/orders  (admin only — all orders)
router.get('/', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const where: any = status ? { status } : {};
    const pageNum = parseInt(String(page));
    const limitNum = parseInt(String(limit));

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { id: true, name: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ success: true, data: orders, total });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/v1/orders/:id/status  (admin only)
router.put('/:id/status', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
