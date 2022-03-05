import { Sequelize } from 'sequelize';

const DB_NAME: string = process.env.DB_NAME as string;
const DB_USERNAME: string = process.env.DB_USERNAME as string;
const DB_PASSWORD: string = process.env.DB_PASSWORD as string;
const DB_HOST: string = process.env.DB_HOST as string;

export default new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mariadb'
});