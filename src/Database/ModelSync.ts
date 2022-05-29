import ModerationModel from './models/ModerationModel';
import TicketSchema from './models/TicketModel';
import MarriageSchema from './models/MarrySchema';
import { SnipeModel } from './models/SnipeModel';
export const syncModels = () => {
	ModerationModel.sync();
	TicketSchema.sync();
	MarriageSchema.sync();
	SnipeModel.sync();
};
