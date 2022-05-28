import { sequelize } from '../mysql';
import { Model, DataTypes } from 'sequelize';

export default class TicketSchema extends Model {
	ticketID!: number;
	guildID!: string;
	userID!: string;
	moderatorID!: string;
	subject!: string;
}

TicketSchema.init(
	{
		ticketID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		guildID: { type: DataTypes.STRING, allowNull: false },
		userID: { type: DataTypes.STRING, allowNull: false },
		moderatorID: { type: DataTypes.STRING, allowNull: false },
		subject: { type: DataTypes.STRING, allowNull: false }
	},
	{ sequelize, tableName: 'Tickets', timestamps: true }
);
