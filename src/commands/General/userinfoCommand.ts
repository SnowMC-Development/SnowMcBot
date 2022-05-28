import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import MarriageSchema from '../../Database/models/MarrySchema';
import { trimArray } from '../../Utils';

const flags: any = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

@ApplyOptions<CommandOptions>({
	description: 'display user info',
	name: 'userinfo'
})
export default class userinfoCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const member = await args.pick('member').catch(() => null);

		const roles = member?.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);
		const userFlags = member?.user.flags?.toArray();

		if (!member) return message.reply(`Invalid usage: Please use, ${this.container.client.options.defaultPrefix}userinfo <user>`);

		const isMarried = await MarriageSchema.findOne({ where: { userID: member.id } });

		const embed = new MessageEmbed()
			.setAuthor({ name: `User info for ${member.user.tag}` })
			.addFields(
				{ name: 'Username', value: member.user.username, inline: true },
				{ name: 'Discriminator', value: member.user.discriminator, inline: true },
				{ name: 'ID', value: member.user.id, inline: true },
				{ name: 'Flags', value: `${userFlags?.length ? userFlags.map((flag) => flags[flag]).join(', ') : 'None'}`, inline: true },
				{ name: 'isBot', value: `${member.user.bot ? 'Yes' : 'No'}`, inline: true },
				{ name: 'Is married:', value: `${isMarried ? 'Yes' : 'No'}`, inline: true },
				{
					name: 'Highest Role',
					value: `${member.roles.highest.id === message.guild?.id ? 'None' : member.roles.highest.name}`,
					inline: true
				},
				{ name: 'Hoist Role', value: `${member.roles.hoist ? member.roles.hoist.name : 'None'}`, inline: true },
				{
					name: `Roles  [${roles?.length}]:`,
					value: `${roles!.length < 10 ? roles!.join(', ') : roles!.length > 10 ? trimArray(roles) : 'None'}`,
					inline: true
				}
			)
			.setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }));

		return message.channel.send({ embeds: [embed] });
	}
}
