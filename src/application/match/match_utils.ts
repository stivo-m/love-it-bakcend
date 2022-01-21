import { getUserByID } from "../auth/authentication";
import { generateChatID, sendMessage } from "../chat/chat_utils";

const userModel = require("../../domain/models/UserModel");

const checkIfMatched = (a: any, b: any) => {
	const firstMatches: Array<any> = a.matches;
	const secondMatches: Array<any> = b.matches;

	return firstMatches.includes(b._id) || secondMatches.includes(a._id);
};

const setMatch = async (id: any, matchID: any) => {
	const user = await getUserByID(id);
	const matchedUser = await getUserByID(matchID);

	// check if either user has matched the other and return a match
	const matched = checkIfMatched(user, matchedUser);

	try {
		await userModel.findByIdAndUpdate(
			{ _id: id },
			{ $push: { matches: [matchID] } },
			{ upsert: true },
		);

		await userModel.findByIdAndUpdate(
			{ _id: matchID },
			{ $push: { matches: [id] } },
			{ upsert: true },
		);
	} catch (error) {
		throw error;
	}

	let chat_id = null;

	if (matched) {
		// start an automatic chat for them
		chat_id = generateChatID(id, matchID);
		await sendMessage(
			chat_id,
			"",
			"",
			"You two have matched! Start chatting now...",
			"System message",
		);
	}

	return {
		haveMatched: matched,
		chatStarted: matched,
		chatID: chat_id,
	};
};

const setDislike = async (id: any, dislikeID: any) => {
	try {
		await userModel.findByIdAndUpdate(
			{ _id: id },
			{ $push: { dislikes: [dislikeID] } },
			{ upsert: true },
		);

		await userModel.findByIdAndUpdate(
			{ _id: dislikeID },
			{ $push: { dislikes: [id] } },
			{ upsert: true },
		);

		return {
			hasDisliked: true,
		};
	} catch (error) {
		throw error;
	}
};

export { checkIfMatched, setMatch, setDislike };
