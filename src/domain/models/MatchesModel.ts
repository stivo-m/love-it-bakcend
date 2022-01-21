import { db } from "../../infrastructure/config/db";
import SchemaOptions from "./SchemaOptions";
const Schema = db.Schema;

const MatchesModel = new Schema(
	{
		users: {
			type: Array,
		},
		isMatched: {
			type: Boolean,
			default: false,
		},
	},
	SchemaOptions,
);
module.exports = db.model("MatchesModel", MatchesModel);
