import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'warns a member',
	preconditions: ['ModOnly'],
	name: 'warn'
})
export class banCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		const reason = await args.rest('string').catch(() => null);

		if (!member || !reason) return message.reply(`Invalid usage: Please use, !warn <user> <reason>`);

		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot warn ${member}.`);

		
		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been warned from the server.', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true},
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: false }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
