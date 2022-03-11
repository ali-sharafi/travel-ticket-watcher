import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database';

export default class City extends Model {
    declare id: number;
    declare name: string;
    declare code: string;
}

City.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    timestamps: false,
    table:'cities'
});
