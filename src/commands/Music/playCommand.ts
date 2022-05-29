import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'play a song',
	name: 'play',
	fullCategory: ['music']
})
export default class playCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const song = await args.pick('string').catch(() => null);

		if (!song) return message.reply('Invalid usage: Please use, play <song>');

		const embed = new MessageEmbed().setDescription(`Now playing: ${song}`).setColor('RANDOM');

		message.channel.send({ embeds: [embed] });
	}
}
