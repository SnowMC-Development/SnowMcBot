import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { ModerationModel } from '../../Database/models/ModerationModel';
@ApplyOptions<CommandOptions>({
	description: 'Unmute a user from the server.',
	name: 'unmute',
	preconditions: ['ModOnly']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		const role: any = message.guild?.roles.cache.find((r) => r.name === 'Muted');

		if (!member ) return message.reply(`Invalid usage: Please use, !mute <user> `);


		await member.roles.remove(role);

        ModerationModel.destroy({ where: { userId: member.id, Casetype: 'Mute' } });

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been unmuted', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: true }
			);

		return message.channel.send({ embeds: [embed] });
	}
}
