import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Command, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { MarriageSchema } from '../../Database/models/MarrySchema';

@ApplyOptions<CommandOptions>({
	description: 'Marry someone',
	name: 'marry'
})
export default class MarryCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);

		if (!member) return message.reply('Please mention a valid member');
		if (member.id === message.author.id) return message.reply("You can't marry yourself");
		const check = await MarriageSchema.findOne({ where: { userID: message.author.id } });

		const check2 = await MarriageSchema.findOne({ where: { partnerID: member.id } });

		if (check) return message.reply('You are already married');

		if (check2) return message.reply('That person is already married');

		//create embed and ask for confirmation
		const embed = new MessageEmbed()
			.setTitle('Marriage Confirmation')
			.setDescription(`${message.author} is about to marry ${member}`)
			.setColor('#ff0000')
			.setFooter({ text: `This is a confirmation message, please react to confirm` })
			.setTimestamp();
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
				const embed = new MessageEmbed().setDescription(`${message.author.username} has married ${member.user.username}`).setColor('RANDOM');
				message.channel.send({ embeds: [embed] });

				MarriageSchema.create({
					userID: message.author.id,
					partnerID: member.id,
					guildID: message.guild!.id,
					marriedAt: new Date(),
					divorced: false
				});
			} else {
				message.reply('Rejected');
			}
		});
	}
}
