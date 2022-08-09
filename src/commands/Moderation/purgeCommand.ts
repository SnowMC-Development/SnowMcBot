import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'delete messages',
	preconditions: ['ModOnly'],
	name: 'purge',
	aliases: ['prune', 'clear'],
	fullCategory: ['Moderation']
})
export default class purgeCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const amount = await args.pick('number').catch(() => null);
		if (!amount) return message.reply(`Invalid usage: Please use, ${this.container.client.options.defaultPrefix}purge <amount>`);
		if (amount > 100) return message.reply('You cannot delete more than 100 messages at a time!');

		if (message.channel.type != 'DM') {
			message.channel.bulkDelete(amount + 1);
			const embed = new MessageEmbed().setDescription(`Deleted ${amount} messages`).setColor('RANDOM');
			message.channel.send({ embeds: [embed] });
		} else {
			message.reply('YOu cannot delete messages in a DM!');
		}
	}
}
