import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../mysql';

export class SnipeModel extends Model {
	channelID!: string;
	content!: string;
	author!: string;
	avatarURL!: string;
	imageURL!: string;
	time!: number;
}

SnipeModel.init(
	{
		channelID: { type: DataTypes.STRING, allowNull: false },
		content: { type: DataTypes.STRING, allowNull: false },
		author: { type: DataTypes.STRING, allowNull: false },
		avatarURL: { type: DataTypes.STRING, allowNull: false },
		imageURL: { type: DataTypes.STRING, allowNull: true },
		time: { type: DataTypes.INTEGER, allowNull: false }
	},
	{ sequelize, timestamps: true, tableName: 'snipes' }
);
