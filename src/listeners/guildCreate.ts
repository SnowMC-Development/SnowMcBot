import { ListenerOptions, PieceContext, Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { GuildModel } from '../Database/models/GuildsModel';

export class UserEvent extends Listener {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: false,
			name: 'guildCreate',
			event: 'guildCreate'
		});
	}

	public async run(guild: Guild) {
		const data = await GuildModel.findOne({ where: { guildId: guild.id } });
		if (data) return;

		try {
			const data = await GuildModel.create({
				guildname: guild.name,
				guildid: guild.id,
				guildowner: guild.ownerId,
				guildroles: guild.roles.cache.size,
				guildmembers: guild.memberCount
			});
			data.save();
		} catch (err) {
			console.log(err);
		}
		console.log(`Table created for ${guild.name}`);
	}
}
