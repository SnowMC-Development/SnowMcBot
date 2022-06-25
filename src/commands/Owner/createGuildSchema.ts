import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { GuildModel } from '../../Database/models/GuildsModel';

@ApplyOptions<CommandOptions>({
	name: 'createguildschema',
	aliases: ['createGuildSchema', 'cgs'],
	description: 'Creates a guild schema',
	preconditions: ['OwnerOnly'],
	fullCategory: ['Owner']
})
export class createGuildSchema extends Command {
	public async messageRun(message: Message) {
		const data = await GuildModel.findOne({ where: { guildId: message.guild!.id } });

		if (data) return message.channel.send('Guild schema already exists for this guild');

		const guild = await GuildModel.create({
			guildname: message.guild!.name,
			guildid: message.guild!.id,
			guildowner: message.guild!.ownerId,
			guildroles: message.guild!.roles.cache.size,
			guildmembers: message.guild!.memberCount
		});

		guild.save();
	}
}
