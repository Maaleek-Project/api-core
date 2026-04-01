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
            price : 100,
            periodicity : 1,
            description : 'Offre standard pour les petites entreprises'
        },
        {
            id: uuidv4(),
            libelle: 'Premium',
            sharing_number: 20,
            code: 'Prm',
            price : 200,
            periodicity : 1,
            description : 'Offre premium pour les grandes entreprises'
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