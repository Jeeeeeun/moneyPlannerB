const {DataTypes, Model} = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init ({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: "users",
    timestamps: false,
});

module.exports = User;