import { ListenerOptions, PieceContext, Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import Erelajs from '../Erelajs';

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
		this.printBanner();
		this.printStoreDebugInformation();

		Erelajs.manager.on('nodeConnect', (node) => {
			this.container.logger.info(`Node ${node.options.identifier} connected.`);
		});

		Erelajs.manager.on('nodeDisconnect', (node) => {
			this.container.logger.info(`Node ${node.options.identifier} disconnected.`);
		});

		Erelajs.manager.on('nodeError', (node, error) => {
			this.container.logger.error(`Node ${node.options.identifier} errored: ${error}`);
		});

		Erelajs.manager.on('nodeReconnect', async (node) => {
			console.log('Node Reconnecting: %s', node.options.identifier);
		});

		Erelajs.manager.init(this.container.client.id as string);
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
