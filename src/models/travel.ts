import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database';
import { TravelTypes } from '../utils/enums';

export default class Travel extends Model {
    declare id: number;
    declare user_id: number;
    declare type: TravelTypes;
    declare origin: number;
    declare destination: number;
    declare date_at: Date;
    declare is_completed: boolean;
    declare max_price: string;
    declare origin_name: string;
    declare destination_name: string;
    declare origin_code: string;
    declare destination_code: string;
}

Travel.init({
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
        type: DataTypes.DATEONLY,
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
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'travels'
});
