import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import {ModerationModel} from '../../Database/models/ModerationModel';

@ApplyOptions<CommandOptions>({
	description: 'Get infractions of a user',
	preconditions: ['ModOnly'],
	name: 'infractions',
	fullCategory: ['Moderation']
})
export default class infractionsCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);

		if (!member) return message.reply(`Invalid usage: Please use, ${this.container.client.options.defaultPrefix}infractions <user>`);

		const data = await ModerationModel.findAll({ where: { userID: member.id } });

		const infractions = data
			.map((inf:any) => {
				return [
					`Case ID: ${inf.getDataValue('id')}`,
					`Moderator: ${inf.getDataValue('moderatorId') || 'Failed to get ID'}`,
					`Date: ${inf.getDataValue('createdAt')}`,
					`Reason: ${inf.getDataValue('reason')}`,
					`Case Type: ${inf.getDataValue('Casetype')}`
				].join('\n');
			})
			.join('\n\n');

		if (!infractions) return message.reply('That user has no infractions!');

		const embed = new MessageEmbed().setDescription(infractions).setColor('RANDOM');

		message.channel.send({ embeds: [embed] });
	}
}
