import app from './app';
import { PrismaClient } from '@prisma/client';

const PORT = process.env.PORT || 5000;

export const prisma = new PrismaClient();

async function startServer() {
  try {
    // Connect to PostgreSQL via Prisma
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL');

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
