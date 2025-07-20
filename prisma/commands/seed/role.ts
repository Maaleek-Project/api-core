import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function RoleSeeder() {
    const roles = [
        {
            id: 1,
            libelle: 'Administrateur',
        },
        {
            id: 2,
            libelle: 'Utilisateur',
        }
    ]

    for (const role of roles) {
        await prisma.role.upsert({
            where: { id: role.id },
            update: role,
            create: role
        })
    }

    console.log('🎉 Roles seeding done.');
}

RoleSeeder()
  .catch((e) => {
    console.error('❌ Error roles seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});