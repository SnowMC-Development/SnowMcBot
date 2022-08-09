import { Manager } from 'erela.js';
import { client } from './index';

const nodes = [
	{
		host: '75.119.134.59',
		password: 'youshallnotpass',
		port: 25501
	}
];

export default class Erelajs {
	static manager: Manager = new Manager({
		nodes,
		send: (id, payload) => {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		}
	});
}
