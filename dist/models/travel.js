"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
const enums_1 = require("../utils/enums");
class Travel extends sequelize_1.Model {
}
exports.default = Travel;
Travel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(enums_1.TravelTypes.AIRPLAN, enums_1.TravelTypes.BUS, enums_1.TravelTypes.TRAIN),
        allowNull: false
    },
    origin: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    destination: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    date_at: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    is_completed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    max_price: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    sequelize: database_1.default,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'travels'
});
