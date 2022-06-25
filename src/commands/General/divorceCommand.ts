import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import {MarriageSchema} from '../../Database/models/MarrySchema';

@ApplyOptions<CommandOptions>({
	description: 'divorce your partner',
	name: 'divorce'
})
export default class divorceCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);

		if (!member) return message.reply('Please mention a valid member');

		if (member.id === message.author.id) return message.reply('YOu cannot divorce yourself');
		const check = await MarriageSchema.findOne({ where: { partnerID: member.id } });

		if (!check) return message.reply('You are not married to that person');

		//Create Conformation embed
		const embed = new MessageEmbed()
			.setTitle('Divorce Confirmation')
			.setDescription(`${message.author} is about to divorce ${member}`)
			.setColor('#ff0000')
			.setFooter({ text: `This is a confirmation message, please react to confirm` });

		const msg = await message.channel.send({ embeds: [embed] });

		msg.react('980192572695777290');
		msg.react('980199499387510884');

		const filter = (reaction: any, user: any) => {
			return ['980192572695777290', '980199499387510884'].includes(reaction.emoji.id) && user.id === member.id;
		};

		const collector = msg.createReactionCollector({
			filter,
			time: 36000 * 1000
		});

		collector.on('collect', (reaction, user) => {
			if (user.bot) return;
			if (reaction.emoji.id === '980192572695777290') {
				MarriageSchema.destroy({ where: { partnerID: member.id, userID: message.author.id } });
				return message.reply('You have divorced your partner');
			} else {
				return message.reply('You have cancelled the divorce');
			}
		});
	}
}
