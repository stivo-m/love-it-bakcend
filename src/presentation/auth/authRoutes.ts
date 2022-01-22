import { Request, Response } from "express";
import { express } from "../../infrastructure/config/app";
const protect = require("../../application/middleware/protect");
const userModel = require("../../domain/models/UserModel");
const router = express.Router();

import {
	comparePasswords,
	createUser,
	getRecommendedProfiles,
	getUserByEmail,
	hashUserPassword,
	setUserJsonPayload,
	signUserAndGetToken,
} from "../../application/auth/authentication";
import { formatJsonError } from "../../application/utils/errors";

/*
    Registration route
    This uses jwt and bcrypt to has the user's password. It further 
    registers them and returns an auth token, along with the user object. 
*/

router.post("/register", async (req: any, res: Response) => {
	const { firstName, lastName, email, password, age, gender } = req.body;

	//validation of fields
	if (!firstName || !lastName || !email || !password || !age || !gender) {
		return res.status(400).json(formatJsonError("Please Provide all fields"));
	}

	// check if the user exists with the email provided.
	const user = await getUserByEmail(email);

	// user already exists
	if (user) {
		return res
			.status(400)
			.json(formatJsonError(`A User with the email ${email} exists`));
	}

	// user does not exist. Register their details
	if (!user) {
		const hashedPassword = await hashUserPassword(password);

		const newUser = {
			firstName,
			lastName,
			email,
			password: hashedPassword,
			age,
			gender,
			status: "active",
		};

		try {
			const payload = await createUser(newUser);
			return res.status(200).json(payload);
		} catch (error) {
			res
				.status(500)
				.json(
					formatJsonError(
						"An error occurred while creating account. Try again later",
					),
				);
		}
	}
});

/*
    Login route
    The objective is to use bcrypt and jwt to compare passwords 
    before the user is allowed to log in. It returns the user object, along with 
*/

router.post("/login", async (req: any, res: Response) => {
	const { email, password, role } = req.body;

	//validation of fields
	if (!email || !password) {
		return res
			.status(400)
			.json(formatJsonError("Please Provide both an email and a password"));
	}

	// check if the user exists with the email provided.
	const user = await getUserByEmail(email);

	if (!user) {
		// user does not exist
		return res
			.status(403)
			.json(formatJsonError(`The User with the email ${email} does not exist`));
	}

	// the user exists. So we validate their credentials
	if (user) {
		try {
			const isPasswordMatched: Boolean = await comparePasswords(
				password,
				user.password,
			);

			// check if passwords matched. If not, return an error
			if (!isPasswordMatched) {
				return res
					.status(400)
					.json(
						formatJsonError(
							`Invalid Credentials for user with email: ${email}`,
						),
					);
			}
			// passwords matched. return the user, along with the token

			const token = signUserAndGetToken(user._id);

			// access the list of all other profiles that can be recommended for this user
			const profiles = await getRecommendedProfiles(user);

			const payload = setUserJsonPayload(user, token, profiles);
			return res.status(200).json(payload);
		} catch (error) {
			res
				.status(500)
				.json(
					formatJsonError(
						"An error occurred while logging in to your account. Try again later",
					),
				);
		}
	}
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
		.then((user: any) => res.status(200).json(setUserJsonPayload(user)));

	if (!user) {
		return res.status(400).json(formatJsonError("No User Found"));
	}
	return user;
});

module.exports = router;
