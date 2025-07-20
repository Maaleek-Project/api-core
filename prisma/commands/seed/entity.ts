import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function EntitySeeder() {
    const entities = [
        {
            id: 1,
            libelle: 'Particulier',
            code: 'Customer',
        },
        {
            id: 2,
            libelle: 'Entreprise',
            code: 'Company',
        }
    ]

    for (const entity of entities) {
        await prisma.entity.upsert({
            where: { id: entity.id },
            update: entity,
            create: entity
        })
    }

    console.log('🎉 Entities seeding done.');
}

EntitySeeder()
  .catch((e) => {
    console.error('❌ Error entities seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});