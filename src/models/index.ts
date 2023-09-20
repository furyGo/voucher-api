import { Sequelize, Model, DataTypes } from 'sequelize';
export const sequelize = new Sequelize({
	dialect: 'mysql',
	username: process.env.DBUSER ?? 'root',
	host: process.env.DBHOST ?? '192.168.100.111',
	password: process.env.DBPWD ?? '123456',
	database: process.env.DBNAME ?? 'temp_vouchers'
});

export class Vouchers extends Model { }

Vouchers.init(
	{
		code: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		address: {
			type: DataTypes.STRING,
			defaultValue: '',
			primaryKey: false
		},
		amount: {
			type: DataTypes.BIGINT,
			defaultValue: 0,
			primaryKey: false
		},
		expiredAt: {
			type: DataTypes.DATE,
			defaultValue: null,
			primaryKey: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('Now()'),
			primaryKey: false
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: null,
			primaryKey: false
		},
		claimdAt: {
			type: DataTypes.DATE,
			defaultValue: null,
			primaryKey: false
		},
		isClaimed: {
			type: DataTypes.BOOLEAN,
			defaultValue: 0,
			primaryKey: false,
		},
		remark: {
			type: DataTypes.STRING,
			defaultValue: '',
			primaryKey: false
		}
	},
	{
		sequelize,
		modelName: 'vouchers'
	}
);
