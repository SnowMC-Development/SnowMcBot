import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { GuildModel } from '../Database/models/GuildsModel';
import { LevelModel } from '../Database/models/LevelModel';
export class UserEvent extends Listener {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: false,
			name: 'guildMemberAdd',
			event: 'guildMemberAdd'
		});
	}

	public async run(member: GuildMember) {
		if (member.user.bot) {
			GuildModel.create({
				guildname: member.guild.name,
				guildid: member.guild.id,
				guildowner: member.guild.ownerId,
				guildroles: member.guild.roles.cache.size
			});
		}

		const user = await LevelModel.findOne({ where: { userId: member.id } })
		
		if (!user) { 
			const data = await LevelModel.create({
				userId: member.id,
				level: 1,
				xp: 0,
				totalxp: 0
			});

			data.save();
		}
	}
}
