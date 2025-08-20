import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AuthentificationService } from '../../../src/core/services/authenfication.service';
import { JwtService } from "@nestjs/jwt";

const prisma = new PrismaClient();
const authentificationService = new AuthentificationService(new JwtService());

export default async function UserSeeder() {

    const country = await prisma.country.findUnique({
        where: { alias : 'CI' }
    })

    const entity = await prisma.entity.findUnique({
        where: { code : 'Manager' }
    })

    const users = [
        {
            id: uuidv4(),
            civility: 'Mr',
            name: 'Djie',
            surname: 'Fabrice',
            number: '0779312475',
            login : 'louisfabrice1@gmail.com',
            password : '12563'
        },
        {
            id: uuidv4(),
            civility: 'Mr',
            name: 'Ofaby',
            surname: 'Oscar',
            number: '0777002625',
            login : 'fabriceo.kouame@gmail.com',
            password : '78564'
        }
    ]

    for (const user of users) {

        const password = await authentificationService.hashPassword(user.password);

        const saved = await prisma.user.upsert({
            where: { email : user.login },
            update: {},
            create: {
                id : user.id,
                civility : user.civility,
                name: user.name,                
                surname: user.surname,
                number: user.number,
                email: user.login,
            }
        })

        await prisma.account.upsert({
            where: {
                login_country_id : {
                    login : user.login,
                    country_id : country!.id
                }
            },
            update: {},
            create: {
                login: user.login,
                fcm_token : `${user.id}@fcm`,
                password: password,
                user_id: saved.id,
                country_id: country!.id,
                entity_id: entity!.id,
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