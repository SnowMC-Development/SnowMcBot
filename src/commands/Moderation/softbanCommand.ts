import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { ModerationModel } from '../../Database/models/ModerationModel';

@ApplyOptions<CommandOptions>({
	description: 'Tempbans a user from the server.',
	preconditions: ['ModOnly'],
	name: 'tempban',
	fullCategory: ['Moderation'],
	aliases: ['softban']
})
export default class softbanCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		const reason = await args.rest('string').catch(() => null);
		const duration = await args.pick('number').catch(() => 1);
		if (!member) return message.reply('Please mention a user to tempban.');
		if (!duration) return message.reply('Please specify a duration.');
		
		if (!reason) return message.reply('Please specify a reason.');
		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot ban ${member}.`);
		try {
			const data = await ModerationModel.create({
				guildId: message.guild?.id,
				userId: member.id,
				moderatorId: message.author.id,
				reason: reason,
				Casetype: 'softban'
			});
			data.save();
		} catch (e) {
			return message.reply(`An error occured ${e}`);
		}

		await member.ban({ reason, days: duration });

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been banned from the server.', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Duration in days', value: `${duration}`, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: false }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
