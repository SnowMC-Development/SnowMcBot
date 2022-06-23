import { sequelize } from '../mysql';
import { Model, DataTypes } from 'Sequelize';

export default class GiveawayModel extends Model {
	guildId!: string;
	messageId!: string;
	channelId!: string;
	title!: string;
	prize!: string;
	duration!: string;
	winners!: Number;
	endsOn!: Date;
	createdOn!: Date;
	winner!: string;
	entries!: JSON;
}

GiveawayModel.init(
	{
		guildId: { type: DataTypes.STRING, allowNull: false },
		messageId: { type: DataTypes.STRING, allowNull: false },
		channelId: { type: DataTypes.STRING, allowNull: false },
		title: { type: DataTypes.STRING, allowNull: false },
		prize: { type: DataTypes.STRING, allowNull: false },
		duration: { type: DataTypes.STRING, allowNull: false },
		winners: { type: DataTypes.INTEGER, allowNull: false },
		endsOn: { type: DataTypes.DATE, allowNull: false },
		createdOn: { type: DataTypes.DATE, allowNull: false },
		winner: { type: DataTypes.STRING, allowNull: false },
		entries: { type: DataTypes.JSON, allowNull: false }
	},
	{ sequelize, tableName: 'Giveaways', timestamps: true }
);
