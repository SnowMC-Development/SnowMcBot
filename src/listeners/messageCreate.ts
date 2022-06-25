import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { LevelModel } from '../Database/models/LevelModel';

@ApplyOptions<ListenerOptions>({
	name: 'messageCreate',
	event: 'messageCreate'
})
export class UserEvent extends Listener {
	public async run(message: Message) {
		if (message.author.bot) return;

		const randomXp = Math.floor(Math.random() * 3);
		const currentXpStats = await LevelModel.findOne({ where: { guildId: message.guild!.id } });

		if (currentXpStats) {
			let xp = currentXpStats.getDataValue('xp');
			let totalxp = currentXpStats.getDataValue('totalxp');
			let level = currentXpStats.getDataValue('level');
			let requiredxp = currentXpStats!.getDataValue('requiredxp');

			xp += randomXp;
			totalxp += randomXp + xp;
			requiredxp = Math.floor(Math.pow(level, 2) * 4);

			currentXpStats.update({ requiredxp });
			currentXpStats.update({ xp });
			currentXpStats.update({ totalxp });

			if (xp >= requiredxp) {
				let updatedLevel = level + 1;
				currentXpStats.update({ level: updatedLevel });
				message.reply(`You have leveled up to level ${updatedLevel}!`);
			}
		} else {
			try {
				const data = await LevelModel.create({
					level: 1,
					xp: 0,
					totalxp: 0,
					userId: message.author!.id,
					guildId: message.guild!.id
				});
				data.save();
			} catch (err) {
				console.log(err);
			}
			message.reply(`Table created for ${message.author.username}`);
		}
	}
}
