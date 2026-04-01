import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function EntitySeeder() {
    const entities = [
        {
            id: uuidv4(),
            libelle: 'Particulier',
            code: 'Customer',
        },
        {
            id: uuidv4(),
            libelle: 'Entreprise',
            code: 'Company',
        },
        {
            id: uuidv4(),
            libelle: 'Gestionnaire',
            code: 'Manager',
        }
    ]

    for (const entity of entities) {
        await prisma.entity.upsert({
            where: { code : entity.code },
            update: {},
            create: entity
        })
    }

    console.log('🎉 Entities seeding done.');
}