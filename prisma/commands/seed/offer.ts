import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function OfferSeeder() {
    const offers = [
        {
            id: uuidv4(),
            libelle: 'Standard',
            sharing_number: 10,
            code: 'Std',
        },
        {
            id: uuidv4(),
            libelle: 'Premium',
            sharing_number: 20,
            code: 'Prm',
        }
    ]

    for (const offer of offers) {
        await prisma.offer.upsert({
            where: { code : offer.code },
            update: {},
            create: offer
        })
    }

    console.log('🎉 Offers seeding done.');
}

OfferSeeder()
  .catch((e) => {
    console.error('❌ Error offers seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});