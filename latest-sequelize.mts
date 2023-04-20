import { Sequelize, Model, DataTypes } from 'sequelize-latest';
import mysql from 'mysql-current';
import {benchmark, range} from './shared.ts';
import config from './config.ts';

const sequelize = new Sequelize(`${config.db.database}LatestSequelize`, config.db.username, config.db.password, { dialect: 'mysql', dialectModule: mysql, pool: config.db.pool, logging: false });

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  birthday: DataTypes.DATE,
});

const dbReset = async () => {
  await User.drop();
  await User.sync();
}

let writeDuration: string | number = 'N/A';
if(process.argv.length < 3 || process.argv[2] !== 'readOnly') {
  await dbReset();
  writeDuration = await benchmark(async () => {
    await Promise.all(range(config.parallelismDegree).map(async () => {
      for (const id of range(config.iterationSize)) {
        await User.create({
          username: `some-user-${id}`,
          birthday: new Date(1980, 6, 20),
        });
      }
    }));
  });
}

let readDuration: string | number = 'N/A';
if(process.argv.length < 3 || process.argv[2] !== 'writeOnly') {
  readDuration = await benchmark(async () => {
    const users = await User.findAll();
    const userIds = users.map((user: any) => user.toJSON().username);

    await Promise.all(range(config.parallelismDegree).map(async () => {
      for (const id of range(config.iterationSize)) {
        const user = await User.findOne({
          where: {
            username: userIds[Math.floor(Math.random() * userIds.length)]
          }
        });

        user.toJSON();
      }
    }));
  });
}

await sequelize.close();
console.log(`Test took ${writeDuration} to write and ${readDuration} to read`);