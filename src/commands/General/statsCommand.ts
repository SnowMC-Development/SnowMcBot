import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { Client } from 'hypixel.ts';
import { API_KEY } from '../../config';
import mcapi from 'minecraft-lookup';
import moment from 'moment';
@ApplyOptions<CommandOptions>({
	description: 'Hypixel stats',
	name: 'stats',
	fullCategory: ['General']
})
export default class statsCommand extends Command {
	public async messageRun(message: Message) {
		

		let client = new Client(API_KEY)
		let player = await client.players.fetch('btsp');
		let firstLogin = new Date(player.firstLogin);
		let lastLogin = new Date(player.lastLogin);
		const skin = await mcapi.skin('btsp');


		const embed = new MessageEmbed()
			.setAuthor({ name: `User info for ${player.displayname}` })
			.addFields(
				{ name: 'Username', value: player.displayname, inline: true },
				{ name: 'UUID', value: player.uuid, inline: true },
				{ name: 'First login', value: `${moment(firstLogin).fromNow()}`, inline: true },
				{ name: 'Last login', value: `${moment(lastLogin).fromNow()}`, inline: true },
				{ name: 'Karma', value: `${player.karma}`, inline: true },
				{ name: 'Network Exp', value: `${player.networkExp}`, inline: true },
				{ name: 'Bedwars Games', value: `${player.stats.Bedwars.games_played_bedwars}`, inline: true },
				{ name: 'Bedwars wins', value: `${player.stats.Bedwars.wins_bedwars}`, inline: true },
				{ name: "Bedwars Kils", value: `${player.stats.Bedwars.kills_bedwars}`, inline: true },
				{ name: 'Duels Games', value: `${player.stats.Duels.games_played_duels}`, inline: true },
				{ name: 'Duels wins', value: `${player.stats.Duels.wins}`, inline: true },
				{ name: "Duels Kils", value: `${player.stats.Duels.kills}`, inline: true},
		)
			.setThumbnail(`${skin.sideview}`)
		return message.channel.send({ embeds: [embed] });
				
	}
}
