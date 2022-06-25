import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import {ModerationModel} from '../../Database/models/ModerationModel';

@ApplyOptions<CommandOptions>({
	description: 'Kick a user from the server.',
	preconditions: ['ModOnly'],
	name: 'kick'
})
export class kickCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		const reason = await args.rest('string').catch(() => null);

		if (!member || !reason) return message.reply(`Invalid usage: Please use, !kick <user> <reason>`);

		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot kick ${member}.`);

		ModerationModel.create({
			guildId: message.guild?.id,
			userId: member.id,
			moderatorId: message.author.id,
			reason: reason,
			Casetype: 'Kick'
		});

		await member.kick(reason);

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been kicked from the server.', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: false }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
