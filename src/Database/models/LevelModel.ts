import { sequelize } from '../mysql';
import { DataTypes, Model } from 'sequelize';

export class LevelModel extends Model {
	level!: number;
	xp!: number;
	totalxp!: number;
	requiredxp!: number;
	userId!: string;
	guildId!: string;
}

LevelModel.init(
	{
		level: { type: DataTypes.INTEGER, allowNull: false },
		xp: { type: DataTypes.INTEGER, allowNull: false },
		totalxp: { type: DataTypes.INTEGER, allowNull: false },
		requiredxp: { type: DataTypes.INTEGER, allowNull: true },
		userId: { type: DataTypes.STRING, allowNull: false },
		guildId: { type: DataTypes.STRING, allowNull: false }
	},
	{ sequelize, timestamps: true, tableName: 'levels' }
);
