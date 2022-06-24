import { sequelize } from '../mysql';
import { DataTypes, Model } from 'sequelize';

export class LevelModel extends Model {
	level!: number;
	xp!: number;
	totalxp!: number;
	userId!: string;
}

LevelModel.init(
	{
		level: { type: DataTypes.INTEGER, allowNull: true },
		xp: { type: DataTypes.INTEGER, allowNull: false },
		totalxp: { type: DataTypes.INTEGER, allowNull: false },
		userId: { type: DataTypes.STRING, allowNull: false }
	},
	{ sequelize, timestamps: true, tableName: 'levels' }
);
