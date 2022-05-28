import { Sequelize } from 'sequelize'
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from '../config'

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    port: 3306
});
