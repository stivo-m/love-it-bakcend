import { db } from "../../infrastructure/config/db";
import SchemaOptions from "./SchemaOptions";
const Schema = db.Schema;

const MessageSchema = new Schema(
	{
		sender: String,
		recipient: String,
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
