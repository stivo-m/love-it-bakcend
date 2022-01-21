import { db } from "../../infrastructure/config/db";
import SchemaOptions from "./SchemaOptions";
import { uuid } from "uuidv4";
const Schema = db.Schema;

const MessageSchema = new Schema(
	{
		chat_id: {
			type: String,
			default: uuid(),
		},
		sender: {
			type: String,
		},
		recipient: {
			type: String,
		},
		message: {
			type: String,
		},
		type: {
			type: String,
			required: true,
			default: null,
		},
	},
	SchemaOptions,
);
module.exports = db.model("MessageSchema", MessageSchema);
