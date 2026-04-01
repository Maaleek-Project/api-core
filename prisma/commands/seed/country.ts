import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function CountrySeeder() {
    const countries = [
        {
            id: uuidv4(),
            libelle: 'Côte d\'Ivoire',
            code: '225',
            alias: 'CI',
            flag: 'https://flagcdn.com/w320/ci.png',
            currency: 'XOF',
        },
        {
            id: uuidv4(),
            libelle: 'Senegal',
            code: '221',
            alias: 'SN',
            flag: 'https://flagcdn.com/w320/sn.png',
            currency: 'XOF',
        }
    ]

    for (const country of countries) {
        await prisma.country.upsert({
            where: { alias: country.alias },
            update: { libelle: country.libelle, code: country.code, flag: country.flag, currency: country.currency },
            create: country
        })
    }

    console.log('🎉 Countries seeding done.');
}