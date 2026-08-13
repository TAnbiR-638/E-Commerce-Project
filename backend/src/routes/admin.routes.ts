import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
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

// GET /api/v1/admin/users — list all users (admin only)
router.get('/users', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/v1/admin/users/:id/role — promote or demote a user
router.patch('/users/:id/role', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be USER or ADMIN' });
    }

    // Prevent self-demotion
    if (req.user?.id === id && role === 'USER') {
      return res.status(400).json({ success: false, message: 'You cannot demote yourself' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/v1/admin/users/:id/password — admin sets a user's password
router.patch('/users/:id/password', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
