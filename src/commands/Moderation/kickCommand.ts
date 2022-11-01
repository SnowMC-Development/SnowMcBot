import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { PrismaClient } from '@prisma/client';

@ApplyOptions<CommandOptions>({
	description: 'kicks a member from the guild',
	name: 'kick',
	preconditions: ['ModOnly'],
	fullCategory: ['Moderation']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const prisma: PrismaClient = new PrismaClient();
		const member = await args.pick('member').catch(() => null);
		const reason = await args.rest('string').catch(() => null);

		if (!member) return message.reply('You must provide a member');
		if (!reason) return message.reply('You must provide a reason');

		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot kick ${member}.`);

		const schema = await prisma.infraction.create({
			data: { moderatorId: message.author.id, offenderId: member.id, reason, type: 'Kick', messageId: message.id }
		});

		await member.kick(reason);

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been banned from the server.', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true },
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: schema.createdAt.toString(), inline: false }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
