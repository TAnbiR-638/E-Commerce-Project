import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/reviews?productId=xxx  — list reviews for a product
router.get('/', (req, res) => {
  const { productId } = req.query;
  res.status(200).json({
    success: true,
    data: [],
    message: productId
      ? `Reviews for product ${productId} (Mock)`
      : 'All reviews (Mock)',
  });
});

// POST /api/v1/reviews — create a review (auth required)
router.post('/', authenticate, (req, res) => {
  const { productId, rating, title, body } = req.body;
  if (!productId || !rating || !title || !body) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  res.status(201).json({
    success: true,
    message: 'Review submitted successfully (Mock)',
    data: {
      id: `r${Date.now()}`,
      userId: req.user?.id,
      productId,
      rating,
      title,
      body,
      helpful: 0,
      createdAt: new Date().toISOString(),
    },
  });
});

// PUT /api/v1/reviews/:id/helpful — mark review as helpful
router.put('/:id/helpful', (req, res) => {
  res.status(200).json({ success: true, message: 'Helpful count updated (Mock)' });
});

export default router;
