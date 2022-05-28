import { Listener } from "@sapphire/framework";
import type { ButtonInteraction, Interaction } from "discord.js";

export class UserEvent extends Listener {
	
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            name: 'interactionCreate',
            event: 'interactionCreate',
        });
    }

    public async run(interaction: Interaction) { 
    
        if (interaction.isButton()) {
			await this.handleButton(interaction);
		}
    }
    
	private handleButton = async (interaction: ButtonInteraction): Promise<void> => {
		if (interaction.customId === 'primary') {
			// handle primary button
			await interaction.reply({ content: 'Primary button clicked!' });
		}
	};
}


