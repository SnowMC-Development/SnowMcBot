import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import Erelajs from '../../Erelajs';
@ApplyOptions<CommandOptions>({
	description: 'play a song',
	name: 'play',
	fullCategory: ['music']
})
export default class playCommand extends Command {
	public async messageRun(message: Message /*args: Args*/) {
		const channel = message.member?.voice;

		if (!channel) return message.reply('you need to be in a voice channel to use this command');

		const player = Erelajs.manager.create({
			guild: message.guild?.id as string,
			textChannel: message.channel.id,
			voiceChannel: channel?.id
		});

		console.log(player);
	}
}
