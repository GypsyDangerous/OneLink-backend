import { loginResult, payload } from "../../types/Auth";
import jwt from "jsonwebtoken";
import User from "../../models/User.model";
import { getAuthSecret, getRefreshSecret } from "./getters";
import { validateCredentials } from "./validation";

export const createAuthToken = (payload: payload): string => {
	return jwt.sign(payload, getAuthSecret(), {
		expiresIn: "1d",
	});
};

export const createRefreshToken = (payload: payload): string => {
	return jwt.sign(payload, getRefreshSecret(), {
		expiresIn: "1d",
	});
};

export const checkAuth = async (token?: string): Promise<payload | null> => {
	if (!token) {
		return null;
	}
	const sections = token.split(" ");
	if (sections[0] !== "Bearer") return null;

	const secret = getAuthSecret();
	const payload: payload | string = jwt.verify(sections[1], secret);
	if (typeof payload === "string") {
		return null;
	} else {
		return payload;
	}
};

export const login = async (email: string, password: string): Promise<loginResult> => {
	const result = validateCredentials({ email, password }, false);
	if (!result.success) return result;
	// email should not be case sensitive
	email = email.toLowerCase();

	// get the user by email and see if it exists, if not return an error
	const user = await User.findOne({ email });
	if (!user) {
		return { success: false, code: 401, message: "Invalid Email or Password" };
	}

	// check if the password hash in the database matches the password that was sent in, if not return an error
	if (user.validPassword(password)) {
		const token = createAuthToken({ userId: user._id, email });

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
	const result = validateCredentials({ email, password, username }, true);
	if (!result.success) return result;

	email = email.toLowerCase();
	const newUser = new User({ username, email });
	newUser.password = newUser.generateHash(password);
	await newUser.save();

	const token = createAuthToken({ userId: newUser._id, email });

	return {
		code: 200,
		success: true,
		message: "Valid Register",
		token: token,
		userId: newUser.id,
	};
};
