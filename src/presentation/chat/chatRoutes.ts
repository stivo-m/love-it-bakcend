import { Response } from "express";
import {
	generateChatID,
	getMessages,
	sendMessage,
	updateMessage,
} from "../../application/chat/chat_utils";
import { formatJsonError } from "../../application/utils/errors";
import { formatResponse } from "../../application/utils/helpers";
import { express } from "../../infrastructure/config/app";
const router = express.Router();
const protect = require("../../application/middleware/protect");

/*
    The route is used to sent a message to a user
*/

router.post("/sendMessage", protect, async (req: any, res: Response) => {
	const { sender, recipient, message, type } = req.body;

	if (!sender || !recipient || !message) {
		return res
			.status(400)
			.json(formatJsonError("One or more fields were not given."));
	}

	const chatID = generateChatID(sender, recipient);

	// all fields exist. Use the utils to send the message
	try {
		const result = await sendMessage(chatID, sender, recipient, message, type);

		return res.status(201).json(formatResponse(result));
	} catch (error) {
		return res
			.status(500)
			.json(
				formatJsonError("An error occurred while sending your message", error),
			);
	}
});

/*
    The route is used to update a message's details
*/

router.post("/updateMessage", protect, async (req: any, res: Response) => {
	const { sender, recipient, message, type, messageID } = req.body;

	if (!sender || !recipient || !message) {
		return res
			.status(400)
			.json(formatJsonError("One or more fields were not given."));
	}

	// all fields exist. Use the utils to update the message
	try {
		const result = await updateMessage(
			sender,
			recipient,
			message,
			type,
			messageID,
		);

		return res.status(200).json(formatResponse(result));
	} catch (error) {
		return res
			.status(500)
			.json(
				formatJsonError("An error occurred while updating your message", error),
			);
	}
});

/*
    The route is used to get messages from a given chat
*/
router.get("/getMessages", protect, async (req: any, res: Response) => {
	const { chatID } = req.body;
	if (!chatID) {
		return res.status(400).json(formatJsonError("Please provide a chat ID"));
	}

	// chat ID is available
	try {
		const result = await getMessages(chatID);

		return res.status(200).json(formatResponse(result));
	} catch (error) {
		return res
			.status(500)
			.json(
				formatJsonError("An error occurred while getting your message", error),
			);
	}
});

module.exports = router;
