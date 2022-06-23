import { ApplyOptions } from '@sapphire/decorators';
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { codeBlock } from '@sapphire/utilities';

@ApplyOptions<CommandOptions>({
	description: 'MEMES',
	name: 'joke'
})
export default class extends Command {
	public async messageRun(message: Message) {
		const data: any = await fetch('https://v2.jokeapi.dev/joke/Any', FetchResultTypes.JSON);

		try {
			const embed = new MessageEmbed()
				.setAuthor({ name: `${data.setup}` } )
				.setDescription(data.delivery)
				.setColor('#FFA500')
				.setFooter({ text: 'Powered by JokeAPI.dev' })
				.setTimestamp();

			message.channel.send({ embeds: [embed] });
		} catch (e) {
			return message.channel.send(`${codeBlock('js', `An error occured ${e}`)}`);
		}
	}
}
