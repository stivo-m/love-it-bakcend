import { db } from "../../infrastructure/config/db";
import SchemaOptions from "./SchemaOptions";
const Schema = db.Schema;

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		age: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
		},
	},
	SchemaOptions,
);
module.exports = db.model("UserSchema", UserSchema);
