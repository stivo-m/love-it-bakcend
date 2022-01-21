import { Request, Response } from "express";

require("dotenv").config();
const jwt = require("jsonwebtoken");

function protect(req: any, res: Response, next: any) {
	//get token from the header value
	const token = req.header(process.env.AUTH_KEY_NAME);
	//decode the token received to obtain the id
	if (!token)
		return res.status(401).json({ text: "No Token. Permission Denied" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		//add the decoded value to the req.body
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ text: "Invalid Token" });
	}
	//call the next middleware
}

module.exports = protect;
