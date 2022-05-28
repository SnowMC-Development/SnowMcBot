import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../mysql';

export default class ModerationModel extends Model {
	id!: number;
	guildId!: string;
	userId!: string;
	moderatorId!: string;
	reason!: string;
	Casetype!: string;
}

ModerationModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		guildId: { type: DataTypes.STRING, allowNull: false },
		userId: { type: DataTypes.STRING, allowNull: false },
		moderatorId: { type: DataTypes.STRING, allowNull: false },
		reason: { type: DataTypes.STRING, allowNull: false },
		Casetype: { type: DataTypes.STRING, allowNull: false }
	},
	{ sequelize, tableName: 'Moderation', timestamps: true }
);
