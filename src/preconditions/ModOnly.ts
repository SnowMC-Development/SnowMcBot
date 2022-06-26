import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { envParseArray } from '../lib/env-parser';

const OWNERS = envParseArray('OWNERS');

export class UserPrecondition extends Precondition {
	public async run(message: Message) {
	
		return message.member?.permissions.has("BAN_MEMBERS")|| OWNERS.includes(message.author.id) 
			? this.ok()
			: this.error({ message: 'This command can only be used by moderators.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ModOnly: never;
	}
}
