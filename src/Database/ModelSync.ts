import { ModerationModel } from './models/ModerationModel';
import { TicketSchema } from './models/TicketModel';
import { MarriageSchema } from './models/MarrySchema';
import { SnipeModel } from './models/SnipeModel';
import { GiveawayModel } from './models/GiveawayModel';
import { GuildModel } from './models/GuildsModel';
export const syncModels = () => {
	ModerationModel.sync();
	TicketSchema.sync();
	MarriageSchema.sync();
	SnipeModel.sync();
	GiveawayModel.sync();
	GuildModel.sync();
};
