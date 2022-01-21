const formatJsonError = (err: any, trace: any = null) => {
	return {
		error: err,
		stackTrace: trace,
	};
};

export { formatJsonError };
