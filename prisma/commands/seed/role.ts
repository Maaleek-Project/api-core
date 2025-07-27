import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function RoleSeeder() {
    const roles = [
        {
            id: uuidv4(),
            libelle: 'Administrateur',
        },
        {
            id: uuidv4(),
            libelle: 'Comptable',
        },
        {
            id: uuidv4(),
            libelle : 'Relation clientelle'
        }
    ]

    for (const role of roles) {
        await prisma.role.upsert({
            where: { libelle: role.libelle },
            update: {},
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