import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';
import { TravelTypes } from '../utils/enums';

const Travel = sequelize.define('Travel', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.ENUM(TravelTypes.AIRPLAN, TravelTypes.BUS, TravelTypes.TRAIN),
        allowNull: false
    },
    origin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    destination: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    max_price: {
        type: DataTypes.STRING,
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Travel;