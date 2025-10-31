import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@booksygo.com' },
    update: {},
    create: {
      email: 'admin@booksygo.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'BooksyGo',
      role: 'ADMIN',
      emailVerified: true,
      points: 1000,
      level: 10,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create test users
  const testPassword = await bcrypt.hash('Test123!', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'demo@booksygo.com' },
    update: {},
    create: {
      email: 'demo@booksygo.com',
      password: testPassword,
      firstName: 'Demo',
      lastName: 'User',
      emailVerified: true,
      points: 500,
      level: 5,
    },
  });

  console.log('✅ Demo user created:', testUser.email);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

