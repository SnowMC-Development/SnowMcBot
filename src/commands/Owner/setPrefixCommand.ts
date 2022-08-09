import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { GuildModel } from '../../Database/models/GuildsModel';

@ApplyOptions<CommandOptions>({
	name: 'setprefix',
	aliases: ['setPrefix', 'sp'],
	description: 'Sets the prefix for the bot',
	preconditions: ['OwnerOnly'],
	fullCategory: ['Owner']
})
export class setPrefix extends Command {
	public async messageRun(message: Message, args: Args) {
		const prefix = await args.pick('string').catch(() => null);
		if (!prefix) return message.channel.send('Please provide a prefix');

		this.container.client.options.defaultPrefix = prefix;
		message.channel.send(`Prefix set to \`${prefix}\``);
		const data = await GuildModel.findOne({ where: { guildId: message.guild!.id } });
		try {
			data?.update({ guildprefix: prefix });
		} catch (err) {
			message.channel.send(`${codeBlock('js', err)}`);
		}
	}
}
