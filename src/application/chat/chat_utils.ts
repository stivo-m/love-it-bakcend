const messageModel = require("../../domain/models/MessageModel");

const sendMessage = async (
	chatID: String,
	sender: String,
	recipient: String,
	message: String,
	type: String,
) => {
	const msg = {
		message,
		type,
		chat_id: chatID,
		sender,
		recipient,
	};

	return await messageModel
		.create(msg)
		.then((_result: any) => _result)
		.catch((e: any) => {
			throw e;
		});
};

const updateMessage = async (
	sender: String,
	recipient: String,
	message: String,
	type: String,
	messageID: String,
) => {
	const msg = {
		message,
		type,
		sender,
		recipient,
	};

	const initialMessage = messageModel.findById(messageID);

	if (!initialMessage) throw Error("Message not found");

	return await messageModel
		.update(initialMessage, msg)
		.then((_result: any) => _result)
		.catch((e: any) => {
			throw e;
		});
};

const getMessages = async (chatID: String) => {
	return await messageModel
		.find({ chat_id: chatID })
		.then((data: any) => data)
		.catch((e: any) => {
			throw e;
		});
};

/*
	generateChatID should be used to get or generate a new chat 
	id between two users. 
*/

const generateChatID = (a: String, b: String) => {
	if (a > b) return `${a}.${b}`;
	else return `${b}.${a}`;
};

export { sendMessage, updateMessage, getMessages, generateChatID };
