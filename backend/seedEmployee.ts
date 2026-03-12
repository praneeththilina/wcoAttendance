import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);
  
  // Create an employee
  const employee = await prisma.user.upsert({
    where: { email: 'employee@firm.com' },
    update: {},
    create: {
      employeeId: 'EMP-001',
      email: 'employee@firm.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'employee',
    },
  });

  // Create a client if none exists
  const client = await prisma.client.upsert({
    where: { name: 'Acme Corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      address: '123 Acme St',
      city: 'New York',
      contactPerson: 'Mr. Acme',
      contactEmail: 'acme@acmecorp.com',
      contactPhone: '555-0100',
    },
  });

  console.log('Employee seeded:', employee.email);
  console.log('Client seeded:', client.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
