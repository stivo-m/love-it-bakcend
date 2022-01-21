const formatResponse = (payload: any, message: any = null) => {
	return {
		data: payload,
		message,
	};
};

export { formatResponse };
