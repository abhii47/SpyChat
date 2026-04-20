import { Sequelize } from 'sequelize';
import { getEnv } from './env';

const sequelize = new Sequelize(
    getEnv('DB_NAME'),
    getEnv('DB_USER'),
    getEnv('DB_PASSWORD'),
    {
        host: getEnv('DB_HOST'),
        port: Number(getEnv('DB_PORT')),
        dialect: 'mysql',
        logging: console.log
    }
);

export default sequelize;