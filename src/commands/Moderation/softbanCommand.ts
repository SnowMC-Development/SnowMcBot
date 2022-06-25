import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import {ModerationModel} from '../../Database/models/ModerationModel';

@ApplyOptions<CommandOptions>({
	description: 'Tempbans a user from the server.',
	preconditions: ['ModOnly'],
	name: 'tempban',
	fullCategory: ['Moderation'],
	aliases: ['softban']
})
export default class softbanCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member: any = await args.pick('member').catch(() => null);
		const reason: any = await args.rest('string').catch(() => null);
		const duration: any = await args.pick('number').catch(() => null);

		if (!member || !reason)
			return message.reply(`Invalid usage: Please use, ${this.container.client.options.defaultPrefix} <user> <reason> <time>`);
		if (!isNaN(duration))
			return message.reply(`Invalid usage: Please use, ${this.container.client.options.defaultPrefix} <user> <reason> <time>`);

		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot tempban ${member}.`);

		await member.ban({ reason, days: duration });

		ModerationModel.create({
			guildId: message.guild?.id,
			userId: member.id,
			moderatorId: message.author.id,
			reason: reason,
			Casetype: 'Softban'
		});

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been tempbanned', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: true },
				{ name: 'Duration', value: duration + ' days', inline: true }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
