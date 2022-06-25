import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { ModerationModel } from '../../Database/models/ModerationModel';
@ApplyOptions<CommandOptions>({
	name: 'timeout',
	description: 'Timeout a user from the server.',
	preconditions: ['ModOnly']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		const reason = await args.rest('string').catch(() => null);
		const time: any = await args.pick('number').catch(() => null);

		if (!member || !reason) return message.reply(`Invalid usage: Please use, !timeout <user> <reason> <time>`);

		if (!isNaN(time)) return message.reply(`Invalid usage: Please use, !timeout <user> <reason> <time>`);

		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot timeout ${member}.`);

		member?.timeout(time * 60 * 1000, reason as string);

		ModerationModel.create({
			guildId: message.guild?.id,
			userId: member.id,
			moderatorId: message.author.id,
			reason: reason,
			Casetype: 'Timeout'
		});

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been timed out', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: false }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
