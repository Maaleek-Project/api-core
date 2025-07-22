import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function UserSeeder() {

    const country = await prisma.country.findUnique({
        where: { alias : 'CI' }
    })

    const users = [
        {
            id: 1,
            civility: 'Mr',
            name: 'Djie',
            surname: 'Fabrice',
            number: '0779312475',
        },
        {
            id: 2,
            civility: 'Mr',
            name: 'Ofaby',
            surname: 'Oscar',
            number: '0777002625',
        }
    ]

    for (const user of users) {
        const saved = await prisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user
        })

        await prisma.account.create({
            data: {
                login: user.number,
                password: '$2b$10$NpWVLok/Y3LzCTJyGQ6ZwuRsLIKAacbw8Rvxf3zkwCwaoUd9.jNkW',
                user_id: saved.id,
                country_id: country!.id,
                entity_id: 1,
                status: 'unconnected'
            }
        })

    }

    console.log('🎉 Users seeding done.');
}

UserSeeder()
  .catch((e) => {
    console.error('❌ Error users seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});