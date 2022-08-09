import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../mysql';

export class GuildModel extends Model {
	guildName!: string;
	guildId!: string;
	guildOwner!: string;
	guildRoles!: string;
	guildMembers!: string;
	guildprefix!: string;
}

GuildModel.init(
	{
		guildname: { type: DataTypes.STRING, allowNull: false },
		guildid: { type: DataTypes.STRING, allowNull: false },
		guildowner: { type: DataTypes.STRING, allowNull: false },
		guildroles: { type: DataTypes.STRING, allowNull: false },
		guildmembers: { type: DataTypes.STRING, allowNull: false },
		guildprefix: { type: DataTypes.STRING, allowNull: false }
	},
	{ sequelize, timestamps: true, tableName: 'guilds' }
);
