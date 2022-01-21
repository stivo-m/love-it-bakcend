class ChatInterface {
	sendMessage(
		sender: String,
		recipient: String,
		message: String,
		type: String,
	) {}
	updateMessage(
		sender: String,
		recipient: String,
		message: String,
		type: String,
	) {}
	getMessages(chatID: String) {}
}
