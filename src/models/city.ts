import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false
});

export default City;