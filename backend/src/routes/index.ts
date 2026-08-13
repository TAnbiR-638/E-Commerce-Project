import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';
import reviewRoutes from './review.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

export default router;
