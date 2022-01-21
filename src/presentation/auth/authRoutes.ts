import { Request, Response } from "express";
import { express } from "../../infrastructure/config/app";
const protect = require("../../application/middleware/protect");
const userModel = require("../../domain/models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

/*
    Registration route
    This uses jwt and bcrypt to has the user's password. It further 
    registers them and returns an auth token, along with the user object. 
*/

router.post("/register", (req: any, res: Response) => {
	const { firstName, lastName, email, password, age, gender } = req.body;

	//validation of fields

	if (!firstName || !lastName || !email || !password || !age || !gender) {
		return res.status(400).json({
			error: "Please Provide all fields",
		});
	}

	//check if user exists
	userModel.findOne({ email }).then((user: any) => {
		if (!user) {
			bcrypt.genSalt(10, (err: any, salt: any) => {
				if (err) throw err;
				bcrypt.hash(password, salt).then((newPass: String) => {
					const newUser = {
						firstName,
						lastName,
						email,
						password: newPass,
						age,
						gender,
						status: "active",
					};

					userModel
						.create(newUser)
						.then((user: any) => {
							jwt.sign(
								{ id: user._id },
								process.env.JWT_PRIVATE_KEY,
								(err: any, token: String) => {
									if (err) {
										res.status(500).json({
											error:
												"An error occurred while creating account. Try again later",
										});
										return;
									}

									res.status(200).json({
										data: {
											user: {
												id: user._id,
												email: user.email,
												firstName: user.firstName,
												lastName: user.lastName,
												status: user.status,
												age: user.age,
												gender: user.gender,
												createdAt: user.created_at,
											},
											token,
										},
									});
								},
							);
						})
						.catch((err: any) => console.log(err));
				});
			});
		} else {
			return res
				.status(400)
				.json({ error: `A User with the email ${email} exists` });
		}
	});
});

/*
    Login route
    The objective is to use bcrypt and jwt to compare passwords 
    before the user is allowed to log in. It returns the user object, along with 
*/

router.post("/login", (req: any, res: Response) => {
	const { email, password, role } = req.body;

	//validation of fields
	if (!email || !password) {
		return res.status(400).json({
			error: "Please Provide both an email and a password",
		});
	}

	//check if user exists
	userModel.findOne({ email }).then((user: any) => {
		if (user) {
			//Compare password matching
			bcrypt.compare(password, user.password).then((isMatch: boolean) => {
				if (!isMatch)
					return res.status(400).json({
						error: `Invalid Credentials for user with email: ${email}`,
					});

				//if passwords do match, return the user without the password
				jwt.sign(
					{ id: user._id },
					process.env.JWT_PRIVATE_KEY,
					(err: any, token: String) => {
						if (err) {
							res.status(500).json({
								error: "An Error occurred while logging in. Try again later.",
							});
							return;
						}

						res.status(200).json({
							data: {
								user: {
									id: user._id,
									email: user.email,
									firstName: user.firstName,
									lastName: user.lastName,
									status: user.status,
									age: user.age,
									gender: user.gender,
									createdAt: user.created_at,
								},
								token,
							},
						});
					},
				);
			});
		} else {
			return res
				.status(400)
				.json({ error: `The User with the email ${email} does not exist` });
		}
	});
});

/*
    Log out route
    Uses the 'protect' middleware to ensure the user's auth token 
    is passed to the request before a log out action is initiated. 
*/

router.post("/logOut", protect, (req: Request, response: Response) => {});

/*
    Profile route
    Uses the 'protect' middleware to ensure the user's auth token 
    is passed to the request before a profile is returned 
*/

router.get("/profile", protect, (req: any, res: Response) => {
	const user = userModel
		.findById(req.user.id)
		.select("-password")
		.then((user: Object) =>
			res.status(200).json({
				data: user,
			}),
		);

	if (!user) {
		return res.status(400).json({ error: "No User Found" });
	}
	return user;
});

module.exports = router;
