import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import ms from 'ms';
import GiveawayModel from '../../Database/models/GiveawayModel';
import schedule from 'node-schedule';
@ApplyOptions<CommandOptions>({
	name: 'gstart',
	description: 'Starts a giveaway',
	aliases: ['giveawaystart']
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
				const gembed = new MessageEmbed().setTitle(title).setColor('#ff0000').setDescription(`
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

				const data = await GiveawayModel.create({
					guildId,
					messageId,
					channelId,
					title,
					prize,
					duration,
					winners,
					endsOn,
					createdOn: new Date()
				});
				await data.save();

				scheduleGiveaway(this.container.client, data);
				message.reply('Giveaway started!');
			} else {
				message.reply('Giveaway cancelled!');
			}
		});
	}
}

async function scheduleGiveaway(client: any, giveaways: any) {
	for (let i = 0; i < giveaways.length; i++) {
		const { channelId, messageId, endsOn } = giveaways[i];
		console.log('Scheduling job for ' + endsOn);
		schedule.scheduleJob(endsOn, async () => {
			const channel = await client.channels.cache.get(channelId);
			if (channel) {
				const message = await channel.messages.fetch(messageId);
				if (message) {
					const { embeds, reactions } = message;
					const reaction = reactions.cache.get('🎉');
					const users = await reaction.users.fetch();
					const entries = users.filter((user: any) => !user.bot).array();
					const winners = entries[0];
					if (embeds.length === 1) {
						const embed = embeds[0];
						embed.setDescription(`~~${embed.description}~~\n**CONGRATS TO: ${winners}**`);
						await message.edit(embed);
					}
				}
			}
		});
	}
}
