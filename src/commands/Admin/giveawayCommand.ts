import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import ms from 'ms';
import { GiveawayModel } from '../../Database/models/GiveawayModel';

@ApplyOptions<CommandOptions>({
	name: 'giveawaystart',
	description: 'Starts a giveaway',
	aliases: ['gstart'],
	fullCategory: ['Admin'],
	preconditions: ['GuildOnly', 'AdminOnly']
})
export default class giveawayCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const channel: TextChannel = message.guild?.channels.cache.find((c) => c.name === 'giveaways') as TextChannel;
		const duration = await args.pick('string').catch(() => null);
		const prize = await args.pick('string').catch(() => null);
		const winners = await args.pick('number').catch(() => 1);
		const title = await args.rest('string').catch(() => null);

		if (!channel) return message.reply("I couldn't find the giveaways channel");
		if (!duration) return message.reply('Please specify a duration');
		if (!prize) return message.reply('Please specify a prize');
		if (!title) return message.reply('Please specify a title');

		const embed = new MessageEmbed()
			.addField('Title', title, true)
			.addField('Prize', prize, true)
			.addField('# of winners', `${winners.toString()}`, true)
			.addField('Duration', `${ms(duration) / 1000 + 's'}`, false);
		const msg = await message.channel.send({ embeds: [embed], content: 'Confirm' });

		await msg.react('👍');
		await msg.react('👎');

		const filter = (reaction: any, user: any) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
		const collector = msg.createReactionCollector({ filter, time: 36000 * 1000 });

		collector.on('collect', async (reaction, user) => {
			if (user.bot) return;
			if (reaction.emoji.name === '👍') {
				let endsOn = new Date(Date.now() + ms(duration));
				const gembed = new MessageEmbed()
					.setTitle(title)
					.setColor('#ff0000')
					.setThumbnail(message.guild?.iconURL() as string).setDescription(`
                        Prize: ${prize}\n
                        Number of winners: ${winners.toString()}\n
                        Ends on: ${endsOn}\n
                        **REACT with 🎉 to ENTER**
                        `);
				const gmsg = await channel.send({ embeds: [gembed] });
				await gmsg.react('🎉');

				let messageId = gmsg.id;
				let guildId = gmsg.guild?.id;
				let channelId = gmsg.channel.id;

				message.channel.send('Giveaway started!');

				setTimeout(async () => {
					const channel = (await this.container.client.channels.cache.get(channelId)) as TextChannel;
					if (channel) {
						let message = await channel.messages.fetch(messageId);
						if (message) {
							let reactions = message.reactions.cache.get('🎉');
							let entries: any = reactions?.users.cache.filter((u) => !u.bot).random();

							const winner = entries?.username;
							console.log(typeof entries);
							const { embeds } = message;
							if (embeds.length === 1) {
								const embed = embeds[0];
								embed.setDescription(`~~${embed.description}~~\n**CONGRATS TO: ${winner ? winner : 'No one reacted..'}**`);
								await message.edit({ embeds: [embed] });
							}

							try {
								const data = await GiveawayModel.create({
									guildId,
									messageId,
									channelId,
									title,
									prize,
									duration,
									winners,
									createdOn: Date.now(),
									endsOn,
									winner,
									entries
								});

								data.save();
							} catch (e) {
								message.channel.send(` ${codeBlock('typescript', e)}`);
							}
						}
					}
				}, ms(duration));
			} else {
				message.reply('Giveaway cancelled!');
			}
		});
	}
}
