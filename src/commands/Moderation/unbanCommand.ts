import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'unban',
	description: 'Unban a user from the server.',
	preconditions: ['ModOnly']
})
export default class unbanCommand extends Command {
	public async messageRun(message: Message) {
		return message.channel.send(`This command is not yet implemented.`);
	}
}
