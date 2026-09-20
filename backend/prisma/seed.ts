import { PrismaClient, Role, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Warden
  await prisma.user.upsert({
    where: { email: 'meera@hostel.ac.in' },
    update: {},
    create: {
      name: 'Dr. Meera Sharma',
      email: 'meera@hostel.ac.in',
      role: Role.WARDEN,
      roomNumber: 'W-01',
    },
  });

  // Staff
  await prisma.user.upsert({
    where: { email: 'rajesh@hostel.ac.in' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'rajesh@hostel.ac.in',
      role: Role.STAFF,
      staffCategory: Category.PLUMBING,
    },
  });

  await prisma.user.upsert({
    where: { email: 'anita@hostel.ac.in' },
    update: {},
    create: {
      name: 'Anita Verma',
      email: 'anita@hostel.ac.in',
      role: Role.STAFF,
      staffCategory: Category.ELECTRICAL,
    },
  });

  await prisma.user.upsert({
    where: { email: 'sunil@hostel.ac.in' },
    update: {},
    create: {
      name: 'Sunil Patel',
      email: 'sunil@hostel.ac.in',
      role: Role.STAFF,
      staffCategory: Category.OTHER, // IT support
    },
  });

  // Students
  await prisma.user.upsert({
    where: { email: 'arjun@student.ac.in' },
    update: {},
    create: {
      name: 'Arjun Mehta',
      email: 'arjun@student.ac.in',
      role: Role.STUDENT,
      roomNumber: 'A-101',
    },
  });

  await prisma.user.upsert({
    where: { email: 'priya@student.ac.in' },
    update: {},
    create: {
      name: 'Priya Singh',
      email: 'priya@student.ac.in',
      role: Role.STUDENT,
      roomNumber: 'B-205',
    },
  });

  await prisma.user.upsert({
    where: { email: 'rohan@student.ac.in' },
    update: {},
    create: {
      name: 'Rohan Das',
      email: 'rohan@student.ac.in',
      role: Role.STUDENT,
      roomNumber: 'A-312',
    },
  });

  await prisma.user.upsert({
    where: { email: 'kavita@student.ac.in' },
    update: {},
    create: {
      name: 'Kavita Nair',
      email: 'kavita@student.ac.in',
      role: Role.STUDENT,
      roomNumber: 'C-118',
    },
  });

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
