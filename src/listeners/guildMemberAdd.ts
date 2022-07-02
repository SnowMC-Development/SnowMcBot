import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';
import { GuildModel } from '../Database/models/GuildsModel';
import { LevelModel } from '../Database/models/LevelModel';
import { ModerationModel } from '../Database/models/ModerationModel';
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
		const data = await GuildModel.findOne({ where: { guildId: member.guild.id } });

		data?.update({ guildMembers: member.guild.memberCount });

		const user = await LevelModel.findOne({ where: { userId: member.id } });
		const isMuted = await ModerationModel.findOne({ where: { userId: member.id, Casetype: 'Mute' } });

		if (isMuted) { 
			const role:any = member.guild.roles.cache.find(r => r.name === 'Muted');
			member.roles.add(role)
		}

		if (!user) {
			const data = await LevelModel.create({
				userId: member.id,
				level: 1,
				xp: 0,
				totalxp: 0,
				guildId: member.guild.id
			});

			data.save();
		}
	}
}
