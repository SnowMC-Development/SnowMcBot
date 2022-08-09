import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'unban',
	description: 'Unban a user from the server.',
	preconditions: ['ModOnly']
})
export default class unbanCommand extends Command {
	public async messageRun(message: Message) {
		const userId = message.content.split(' ')[1] || message.mentions.users.first()?.id;
		const bans = await message.guild?.bans.fetch();
		const ban = bans?.find((ban) => ban.user.id === userId);

		if (!userId) {
			const nUser = new MessageEmbed()
				.setDescription(`Ìnvalid usage! Please use \`${this.container.client.options.defaultPrefix}unban <user id>\``)
				.setThumbnail(message.guild?.iconURL() as string)
				.setColor('#ff0000');
			return message.channel.send({ embeds: [nUser] });
		}
		if (!bans) {
			const nBan = new MessageEmbed()
				.setDescription(`Couldn't find ban for \`${ban?.user.tag}\``)
				.setThumbnail(message.guild?.iconURL() as string)
				.setColor('#ff0000');
			return message.channel.send({ embeds: [nBan] });
		}

		if (!ban) {
			const nBan2 = new MessageEmbed()
				.setDescription(`User is not banned from this server!`)
				.setThumbnail(message.guild?.iconURL() as string)
				.setColor('#ff0000');
			return message.channel.send({ embeds: [nBan2] });
		}

		await message.guild?.members.unban(userId);

		return message.reply(`Successfully unbanned ${ban.user.tag}`);
	}
}
