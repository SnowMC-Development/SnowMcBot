import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'unban',
	description: 'Unban a user from the server.',
	preconditions: ['ModOnly']
})
export default class unbanCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		if (!member) return message.reply(`Invalid usage: Please use, !unban <user>`);
		message.guild?.members.unban(member.id);

		message.channel.send('Unbanned ' + member.user.tag);
	}
}
