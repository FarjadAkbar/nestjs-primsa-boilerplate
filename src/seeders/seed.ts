import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('--------------Seeding Start----------------');
    // console.log('=======AdminSeeder=========');
    // createAdmin(prisma);
    // console.log('=======UserSeeder=========');
    // createUser(prisma);
    // console.log('=======DriverSeeder=========');
    // createDriver(prisma);
    // console.log('=======RiderSeeder=========');
    // createRider(prisma);
    // console.log('=======Role And Permissions Seeder=========');
    // createRolesAndPermissions(prisma);
}

main()
    .then(async () => {
        console.log('------------Seeding done!-------------');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        // process.exit(1);
    });
