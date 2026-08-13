import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/admin/stats
router.get('/stats', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueAgg, recentOrders, topProducts] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { reviewCount: 'desc' },
        select: { id: true, name: true, price: true, stock: true, rating: true, images: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: revenueAgg._sum.total || 0,
        totalOrders,
        totalProducts,
        totalUsers,
        recentOrders,
        topProducts,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/categories
router.get('/categories', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
