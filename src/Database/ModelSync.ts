import ModerationModel from './models/ModerationModel';
import TicketSchema from './models/TicketModel';
import MarriageSchema from './models/MarrySchema';

export const syncModels = () => {
	ModerationModel.sync();
	TicketSchema.sync();
	MarriageSchema.sync();
};
