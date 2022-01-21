const userModel = require("../../domain/models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getUserByEmail = async (email: String) =>
	userModel.findOne({ email }).then((user: any) => user);

const getUserByID = async (id: any) =>
	userModel.findById(id).then((user: any) => user);

const hashUserPassword = async (password: String) => {
	const salt = await bcrypt.genSalt(10);

	const hashedPassCode = await bcrypt
		.hash(password, salt)
		.then((newPassword: String) => newPassword)
		.catch((e: any) => {
			throw e;
		});

	return hashedPassCode;
};

const comparePasswords = async (a: String, b: String) => {
	return bcrypt
		.compare(a, b)
		.then((isMatch: Boolean) => isMatch)
		.catch((e: any) => {
			throw e;
		});
};

const signUserAndGetToken = (id: any) => {
	return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY);
};

const setUserJsonPayload = (user: any, token = null) => {
	return {
		data: {
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
	};
};

const createUser = async (userDetails: any) => {
	return await userModel
		.create(userDetails)
		.then((user: any) => {
			try {
				const token = signUserAndGetToken(user._id);
				return setUserJsonPayload(user, token);
			} catch (error) {
				// throwing this error allows the catch on the create above
				// to return the error to the caller
				throw error;
			}
		})
		.catch((error: any) => {
			throw error;
		});
};

export {
	getUserByEmail,
	hashUserPassword,
	signUserAndGetToken,
	setUserJsonPayload,
	createUser,
	comparePasswords,
	getUserByID,
};
