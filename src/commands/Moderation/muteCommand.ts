import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Mute a user from the server.',
	name: 'mute',
	preconditions: ['ModOnly']
})
	
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);
		const reason = await args.rest('string').catch(() => null);
		const role: any = message.guild?.roles.cache.find(r => r.name === 'Muted');

		if (!member || !reason) return message.reply(`Invalid usage: Please use, !mute <user> <reason>`);

		if (!role) { 
			await message.guild?.roles.create({ name: 'Muted', color: "BLURPLE", mentionable: false })
			message.channel.send(`Couldn't find the muted role so I created one for you!`)
		}

		if (member.roles.highest.position >= message.member!.roles.highest.position) return message.reply(`You cannot mute ${member}.`);
		
		await member.roles.add(role);

		const embed = new MessageEmbed()
			.setAuthor({ name: member.user.tag + ' has been muted', iconURL: member.user.displayAvatarURL() })
			.setThumbnail(message.guild!.iconURL({ dynamic: true }) as string)
			.addFields(
				{ name: 'Reason', value: reason, inline: true},
				{ name: 'Moderator', value: message.author.tag, inline: true },
				{ name: 'Date', value: new Date().toLocaleString(), inline: false }
			);

		return message.channel.send({ embeds: [embed] });
		
	}
}
