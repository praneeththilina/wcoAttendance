import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users (password: password123)
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      employeeId: 'AUDIT-001',
      email: 'john.doe@auditfirm.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'employee' as const,
    },
    {
      employeeId: 'AUDIT-002',
      email: 'jane.smith@auditfirm.com',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'employee' as const,
    },
    {
      employeeId: 'ADMIN-001',
      email: 'admin@auditfirm.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const,
    },
    {
      employeeId: 'MGR-001',
      email: 'manager@auditfirm.com',
      passwordHash,
      firstName: 'Manager',
      lastName: 'User',
      role: 'manager' as const,
    },
    {
      employeeId: 'HR-001',
      email: 'hr@auditfirm.com',
      passwordHash,
      firstName: 'HR',
      lastName: 'User',
      role: 'hr' as const,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash: user.passwordHash },
      create: user,
    });
  }

  console.log('Created users');

  // Create sample clients
  const clients = [
    {
      name: 'Acme Corporation',
      branch: 'Main Office',
      city: 'New York',
      address: '123 Business Ave, Manhattan',
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      name: 'TechStart Inc',
      branch: 'Headquarters',
      city: 'San Francisco',
      address: '456 Innovation Blvd',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    {
      name: 'Global Services Ltd',
      branch: 'Branch Office',
      city: 'Chicago',
      address: '789 Lake Shore Dr',
      latitude: 41.8781,
      longitude: -87.6298,
    },
    {
      name: 'Finance Corp',
      branch: 'Main Office',
      city: 'Boston',
      address: '321 Financial District',
      latitude: 42.3601,
      longitude: -71.0589,
    },
    {
      name: 'Healthcare Plus',
      branch: 'Regional Office',
      city: 'Los Angeles',
      address: '555 Health Way',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    {
      name: 'Retail Masters',
      branch: 'Downtown',
      city: 'Miami',
      address: '999 Ocean Drive',
      latitude: 25.7617,
      longitude: -80.1918,
    },
    {
      name: 'Tech Solutions',
      branch: 'Headquarters',
      city: 'Seattle',
      address: '111 Tech Plaza',
      latitude: 47.6062,
      longitude: -122.3321,
    },
    {
      name: 'Media Group',
      branch: 'Main Office',
      city: 'Austin',
      address: '222 Media Lane',
      latitude: 30.2672,
      longitude: -97.7431,
    },
  ];

  for (const client of clients) {
    const existing = await prisma.client.findFirst({ where: { name: client.name } });
    if (!existing) {
      await prisma.client.create({ data: client });
    }
  }

  console.log('Created clients');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
