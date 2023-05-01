import Sequelize from 'sequelize-current';
import {benchmark, range} from './shared.ts';
import config from './config.ts';

const sequelize = new Sequelize(`${config.db.database}CurrentState`, config.db.username, config.db.password, { dialect: 'mysql', dialectModulePath: '/Users/moshe/Projects/orm-playground/node_modules/mysql-current', pool: config.db.pool, logging: false });
const User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE,
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
      for(let i = 0; i < config.iterationSize; i++) {
        const user: any = await User.findOne({
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