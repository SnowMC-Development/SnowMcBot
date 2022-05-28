import { sequelize } from '../mysql';
import { Model, DataTypes } from 'Sequelize';

export default class MarriageSchema extends Model {
	userID!: string;
	partnerID!: string;
	guildID!: string;
	marriedAt!: Date;
	divorced!: boolean;
}

MarriageSchema.init(
	{
		userID: { type: DataTypes.STRING, allowNull: false },
		partnerID: { type: DataTypes.STRING, allowNull: false },
		guildID: { type: DataTypes.STRING, allowNull: false },
		marriedAt: { type: DataTypes.DATE, allowNull: false },
		divorced: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
	},
	{ sequelize, tableName: 'Marriages', timestamps: true }
);
