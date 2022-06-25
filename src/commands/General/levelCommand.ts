import { LevelModel } from '../../Database/models/LevelModel';
import { Message, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<CommandOptions>({
	name: 'level',
	description: 'Check your level and xp.',
	preconditions: ['GuildOnly'],
	aliases: ['lvl']
})
export class LevelCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => message.member);

		const data = await LevelModel.findOne({ where: { guildId: message.guild!.id } });
		if (!data) return message.channel.send('No xp stats found for this user.');

		const reqxp = data.getDataValue('requiredxp');

		try {
			const embed = new MessageEmbed()
				.setAuthor({ name: `User info for ${member?.user.username}` })
				.setDescription(
					`${member?.user.username} is level **${data.getDataValue('level')}** in the server with a total XP of **${data.getDataValue(
						'totalxp'
					)}**. Required XP for next level is **${reqxp}** XP.`
				)

				.setThumbnail(member?.user.displayAvatarURL({ format: 'png', dynamic: true }) as string);

			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			message.channel.send(`${codeBlock('js', e)}`);
		}
	}
}
