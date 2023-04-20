import {benchmark, range} from './shared.ts';
import config from "./config.ts";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const dbReset = async () => {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Users;');
    await prisma.$executeRawUnsafe(
        'CREATE TABLE Users (\n' +
        '    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n' +
        '    username VARCHAR(255) NOT NULL UNIQUE,\n' +
        '    birthday DATE NOT NULL,\n' +
        '    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n' +
        '    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n' +
        ');'
    );
}

let writeDuration: string | number = 'N/A';
if(process.argv.length < 3 || process.argv[2] !== 'readOnly') {
    await dbReset();
    writeDuration = await benchmark(async () => {
        await Promise.all(range(config.parallelismDegree).map(async () => {
            for (const id of range(config.iterationSize)) {
                await prisma.users.create({
                    data: {
                        username: `some-user-${id}`,
                        birthday: new Date(1980, 6, 20),
                    },
                });
            }
        }));
    });
}

let readDuration: string | number = 'N/A';
if(process.argv.length < 3 || process.argv[2] !== 'writeOnly') {
    readDuration = await benchmark(async () => {
        const users = await prisma.users.findMany();
        const userIds = users.map((user) => user.username);

        await Promise.all(range(config.parallelismDegree).map(async () => {
            for (const id of range(config.iterationSize)) {
                await prisma.users.findUnique({
                    where: {
                        username: userIds[Math.floor(Math.random() * userIds.length)]
                    }
                });
            }
        }));
    });
}

await prisma.$disconnect();
console.log(`Test took ${writeDuration} to write and ${readDuration} to read`);