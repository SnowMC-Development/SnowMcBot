import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { Message, MessageEmbed } from 'discord.js';
import { SnipeModel } from '../../Database/models/SnipeModel';

@ApplyOptions<CommandOptions>({
	name: 'snipe',
	description: 'snipes a deleted message',
	preconditions: ['ModOnly']
})
export default class SnipeCommand extends Command {
	public async messageRun(message: Message) {
		let data = await SnipeModel.findOne({ where: { channelID: message.channel.id } });
		if (!data) {
			const embed = new MessageEmbed()
				.setColor('#ff0000')
				.setTitle('No snipe data found')
				.setDescription('There is no snipe data. Please delete the message you want to snipe and try again.');
			return message.channel.send({ embeds: [embed] });
		}
		if (data) {
			try {
				const embed = new MessageEmbed()
					.setAuthor({ name: data.getDataValue('author'), iconURL: data.getDataValue('avatarURL') })
					.setDescription(`Conent: ${data.getDataValue('content')}`)
					.addField('Sniped by', `${message.author.username}`, true)
					.setImage(data.getDataValue('imageURL'))
					.addField('Channel ID', `${message.channel.id}`, true)
					.addField('Time', `<t:${data.getDataValue('time')}:R>`, true);
				return message.channel.send({ embeds: [embed] });
			} catch (e) {
				return message.channel.send(`${codeBlock('js', `An error occured ${e}`)}`);
			}
		}
	}
}
