import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { envParseArray } from '../lib/env-parser';
const OWNERS = envParseArray('OWNERS');
export class UserPrecondition extends Precondition {
	public async run(message: Message) {
		return message.member?.roles.cache.find((r) => r.name === 'Admin') || OWNERS.includes(message.author.id)
			? this.ok()
			: this.error({ message: 'This command can only be used by admins.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		AdminOnly: never;
	}
}
