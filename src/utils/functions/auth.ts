import { loginResult, payload } from "../../types/Auth";
import jwt from "jsonwebtoken";
import User from "../../models/User.model";
import {
	passwordMin,
	passwordMax,
	usernameMin,
	usernameMax,
	emailMin,

} from "../constants";

export const checkAuth = async (token?: string): Promise<payload | null> => {
	if (!token) {
		return null;
	}
	const secret = process.env.PRIVATE_KEY;
	if (!secret) {
		console.log("JWT Private key is not set. please set one immediately");
		process.exit(1);
	}
	const payload: payload | string = jwt.verify(token, secret);
	if (typeof payload === "string") {
		return null;
	} else {
		return payload;
	}
};

export const login = async (email: string, password: string): Promise<loginResult> => {
	if (!password || password.length < passwordMin || password.length > passwordMax) {
		return {
			success: false,
			code: 400,
			message: "Error: password is invalid or missing",
		};
	}
	if (!email || email.length < emailMin) {
		return { success: false, code: 400, message: "Error: email is invalid or missing" };
	}

	// email should not be case sensitive
	email = email.toLowerCase();

	// get the user by email and see if it exists, if not return an error
	const user = await User.findOne({ email });
	if (!user) {
		return { success: false, code: 401, message: "Invalid Email or Password" };
	}

	// check if the password hash in the database matches the password that was sent in, if not return an error
	if (user.validPassword(password)) {
		const token = await jwt.sign(
			{ userId: user.id, email: email },
			process.env.PRIVATE_KEY || "",
			{
				expiresIn: "1d",
			}
		);

		return {
			code: 200,
			success: true,
			message: "Valid Sign in",
			token: token,
			userId: user._id,
		};
	} else {
		return { success: false, code: 401, message: "Invalid Email or Password" };
	}
};

export const register = async (
	username: string,
	email: string,
	password: string
): Promise<loginResult> => {
	if (!password || password.length < passwordMin || password.length > passwordMax) {
		return {
			success: false,
			code: 400,
			message: "Error: password is invalid or missing",
		};
	}
	if (!email || email.length < emailMin) {
		return { success: false, code: 400, message: "Error: email is invalid or missing" };
	}
	if (!username || username.length < usernameMin || username.length > usernameMax) {
		return {
			success: false,
			code: 400,
			message: "Error: username is invalid or missing",
		};
	}

	email = email.toLowerCase();
	const newUser = new User({ username, email });
	newUser.password = newUser.generateHash(password);
	await newUser.save();

	const token = await jwt.sign(
		{ userId: newUser._id, email: email },
		process.env.PRIVATE_KEY || "",
		{
			expiresIn: "1d",
		}
	);

	return {
		code: 200,
		success: true,
		message: "Valid Register",
		token: token,
		userId: newUser.id,
	};
};