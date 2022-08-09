import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { SnipeModel } from '../Database/models/SnipeModel';

@ApplyOptions<ListenerOptions>({
	name: 'messageDelete',
	event: 'messageDelete'
})
export class UserEvent extends Listener {
	public async run(message: Message) {
		const image = message.attachments.first() ? message.attachments.first()?.proxyURL : null;

		const data = await SnipeModel.findOne({ where: { channelID: message.channel.id } });

		if (!data) {
			let newData = await SnipeModel.create({
				avatarURL: message.author.avatarURL(),
				imageURL: image,
				channelID: message.channel.id,
				content: message.content,
				author: message.author.username,
				time: Math.floor(Date.now() / 1000)
			});

			return newData.save();
		}

		await data.update({
			channelID: message.channel?.id,
			avatarURL: message.author.avatarURL(),
			imageURL: image,
			author: message.author.username,
			content: message.content,
			time: Math.floor(Date.now() / 1000)
		});
	}
}
