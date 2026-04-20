const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const start = Date.now();
  await Promise.all([
    prisma.user.findMany({}),
    prisma.attendanceRecord.findMany({})
  ]);
  const end = Date.now();
  console.log(`Time taken: ${end - start}ms`);
}

run();
