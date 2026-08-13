import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Mock endpoints for demonstration purposes

router.get('/profile', authenticate, (req, res) => {
  res.status(200).json({ success: true, data: { id: req.user?.id } });
});

router.get('/', authenticate, authorize(['ADMIN']), (req, res) => {
  res.status(200).json({ success: true, data: [] });
});

export default router;
