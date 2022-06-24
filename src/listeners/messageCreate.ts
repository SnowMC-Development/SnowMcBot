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
        const currentXpStats = await LevelModel.findOne({ where: { userid: message.author.id } });
        
        if (!currentXpStats) return message.reply("No xp stats found for this user.");
        
        let xp = currentXpStats.getDataValue('xp');
        let totalxp = currentXpStats.getDataValue('totalxp');
        let level = currentXpStats.getDataValue('level');
        xp += randomXp;
        totalxp += randomXp;

        currentXpStats.update({ xp })
        currentXpStats.update({ totalxp })
        

        if (xp >= level * 15) {
            let updatedLevel = level + 1;
            currentXpStats.update({ level: updatedLevel })
            message.reply(`You have leveled up to level ${updatedLevel}!`);
        }

	}
}
