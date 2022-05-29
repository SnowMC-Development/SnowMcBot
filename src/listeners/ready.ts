import { ListenerOptions, PieceContext, Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { Manager } from 'erela.js';

const dev = process.env.NODE_ENV !== 'production';


export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true
		});
	}

	public run() {
		const client = this.container.client;
		const manager = new Manager({
			// Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
			nodes: [
				// If you pass a object like so the "host" property is required
				{
					host: '75.119.134.59', // Optional if Lavalink is local
					port: 25501, // Optional if Lavalink is set to default
					password: 'youshallnotpass' // Optional if Lavalink is set to default
				}
			],
			// A send method to send data to the Discord WebSocket using your library.
			// Getting the shard for the guild and sending the data to the WebSocket.
			send(id, payload) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			}
		});

		manager.on('nodeConnect', (node) => console.log(`Node ${node.options.identifier} connected`));
		manager.on('nodeError', (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`));
		manager.on('trackStart', (player, track) => {
			console.log(`Track ${track} started playing in ${player.guild}`);
			//client.channels.cache.get(player.textChannel).send(`Now playing: ${track.title}`);
		});
		manager.on('queueEnd', (player) => {
			console.log('Queue ended');

			player.destroy();
		});


		manager.init(client.user?.id);

		this.printBanner();
		this.printStoreDebugInformation();
	}

	private printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
