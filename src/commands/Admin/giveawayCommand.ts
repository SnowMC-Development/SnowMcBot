import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import ms from 'ms';
import GiveawayModel from '../../Database/models/GiveawayModel';

const prompts: any = ['Give this giveaway a title', 'What are you giving away?', 'How long do you want this giveaway to last?', 'How many winners?'];

@ApplyOptions<CommandOptions>({
	description: 'stat a giveaway',
	name: 'giveaway',
	fullCategory: ['Admin'],
	preconditions: ['AdminOnly']
})
export default class giveawayCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const state = await args.pick('string').catch(() => null);
		const channel = (await message.guild?.channels.cache.find((c) => c.name === 'giveaways')) as TextChannel;

		try {
			switch (state) {
				case 'start':
					const response = await getResponses(message);
					const embed = new MessageEmbed()
						.addFields(
							{ name: 'Title', value: `${response.title}`, inline: true },
							{ name: 'Prize', value: `${response.prize}`, inline: true },
							{ name: 'Duration', value: `${response.duration}`, inline: true },
							{ name: 'Winners', value: `${response.winners}`, inline: true }
						)
						.setThumbnail(message.guild?.iconURL({ dynamic: true }) as string);
					const msg = await message.channel.send({ embeds: [embed], content: 'Confirm' });
					await msg.react('980192572695777290');
					await msg.react('980199499387510884');

					//create reaction filter
					const filter = (reaction: any, user: any) => {
						return ['980192572695777290', '980199499387510884'].includes(reaction.emoji.id) && user.id === message.author.id;
					};
					const reactions = await msg.createReactionCollector({
						filter,
						max: 1,
						time: 30e3
					});

					reactions.on('collect', async (reaction, user) => {
						if (reaction.emoji.id === '980192572695777290' && !user.bot) {
							//response.endsOn = new Date(Date.now() + ms(response.duration));
							const gembed = new MessageEmbed()
								.setTitle(response.title.toString())
								.setColor('#ff0000')
								.setDescription(
									`
                        Prize: ${response.prize}\n
                        Number of winners: ${response.winners}\n
                        Ends on: ${new Date(Date.now()) + ms(response.duration)}\n
                        **REACT with 🎉 to ENTER**
                        `
								)
								.setThumbnail(message.guild?.iconURL({ dynamic: true }) as string);
							const gmsg = await channel.send({ embeds: [gembed] });
							await gmsg.react('🎉');
							let messageId = gmsg.id;
							let guildId = gmsg.guild?.id;
							let channelId = gmsg.channel.id;

							console.log([messageId, guildId, channelId].join('\n'));
						} else {
							message.channel.send('Giveaway cancelled.');
						}
					});
					break;
				case 'end':
					const channelID = await args.pick('string').catch(() => null);
					if (!channelID) return message.channel.send('Please specify a channel ID');

					const data = GiveawayModel.findOne({ where: { channelId: channelID } });

					if (!data) return message.reply("Invalid giveaway")
					message.reply('giveaway ended');
					GiveawayModel.update({ ended: true }, { where: { channelId: channelID } });
					break;
				default:
					message.reply('invalid state');
			}
		} catch (e) {
			message.channel.send(`${codeBlock('typescript', e)}`);
		}
	}
}

async function getResponses(message: Message) {
	const vaildTime = /^\d+(s|m|h|d)$/;
	const vaildNumber = /\d+/;
	const responses: any = {};

	for (let i = 0; i < prompts.length; i++) {
		await message.channel.send(prompts[i]);
		const filter = (m: Message) => m.author.id === message.author.id;
		const response = await message.channel.awaitMessages({ filter, max: 1, time: 30e6, errors: ['time'] });
		const content: any = response.first();

		if (i == 0) responses.title = content;
		else if (i == 1) responses.prize = content;
		else if (i == 2) {
			if (vaildTime.test(content)) responses.duration = content;
			else throw new Error('Invaild time format');
		} else if (i == 3) {
			if (vaildNumber.test(content)) responses.winners = content;
			else throw new Error('Invaild numbers of winners');
		}
	}
	return responses;
}
