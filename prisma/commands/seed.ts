// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



async function main() {

  const countries = 
  [
    {
        id : 1,
        libelle : 'Côte d\'Ivoire',
        code : '225',
        alias : 'CI',
        flag : 'https://flagcdn.com/w320/ci.png',
        currency : 'FCFA',
    },
    {
        id : 2,
        libelle : 'Senegal',
        code : '221',
        alias : 'SN',
        flag : 'https://flagcdn.com/w320/sn.png',
        currency : 'FCFA',
    }
  ]  

  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        id: country.id,
      },
      update: country,
      create: country,
    });
  }

  console.log('🎉 Seeding done.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
