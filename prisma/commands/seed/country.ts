import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CountrySeeder() {
    const countries = [
        {
            id: 1,
            libelle: 'Côte d\'Ivoire',
            code: '225',
            alias: 'CI',
            flag: 'https://flagcdn.com/w320/ci.png',
            currency: 'XOF',
        },
        {
            id: 2,
            libelle: 'Senegal',
            code: '221',
            alias: 'SN',
            flag: 'https://flagcdn.com/w320/sn.png',
            currency: 'XOF',
        }
    ]

    for (const country of countries) {
        await prisma.country.upsert({
            where: { id: country.id },
            update: country,
            create: country
        })
    }

    console.log('🎉 Countries seeding done.');
}

CountrySeeder()
  .catch((e) => {
    console.error('❌ Error countries seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});