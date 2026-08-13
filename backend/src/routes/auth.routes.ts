import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });

// POST /api/v1/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = signToken(user.id, user.role);
    res.status(201).json({ success: true, token, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user.id, user.role);
    const { password: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

export default router;
