import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      process.env.ADMIN_URL  || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    if (!origin || allowed.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate Limiting
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from './lib/redis';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json());

// API Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

export default app;
