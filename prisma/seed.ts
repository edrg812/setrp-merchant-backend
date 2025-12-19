import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  /* ---------------- ROLES ---------------- */
  const roles = [
    'SUPER_ADMIN',
    'ADMIN',
    'MERCHANT',
    'USER',
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  /* ---------------- PERMISSIONS ---------------- */
  const permissions = [
    'user.create',
    'user.read',
    'user.update',
    'user.delete',

    'role.create',
    'role.assign',
    'role.read',

    'merchant.read',
    'merchant.update',

    'payment.read',
    'payment.create',

    'balance.read',
    'balance.update',
    'balance.create',
    'balance.delete',
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm },        // ✅ FIXED
      update: {},
      create: { code: perm },       // ✅ FIXED
    });
  }

  /* ---------------- SUPER_ADMIN → ALL PERMISSIONS ---------------- */
  const superAdmin = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  if (!superAdmin) {
    throw new Error('SUPER_ADMIN role not found');
  }

  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdmin.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdmin.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ RBAC seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




