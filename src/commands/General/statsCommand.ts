import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { HypixelAPI } from 'hypixel-api-v2';
import { API_KEY } from '../../config';

@ApplyOptions<CommandOptions>({
	description: 'Hypixel stats',
	name: 'stats',
	fullCategory: ['General']
})
export default class statsCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const user: any = args.pick('string').catch(() => null);

		if (!user) return message.channel.send('Please enter a player name');

		const hypixel = await new HypixelAPI(API_KEY);
		const player = await hypixel.player(user);
		console.log(`${player.displayname} has ${player.networkExp} experience.`);
	}
}
