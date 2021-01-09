import { AuthResult, payload } from "../../types/Auth";
import jwt from "jsonwebtoken";
import User from "../../models/User.model";
import {
	getAuthSecret,
	getRefreshSecret,
	getResetSecret,
	get_image_filename,
	get_url_extension,
} from "./getters";
import { validateCredentials } from "./validation";
import { Context } from "../../types/Request";
import { OAuth2Client } from "google-auth-library";
import { downloadFile } from ".";
import { createPage } from "./page";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const createAuthToken = (payload: payload): string => {
	return jwt.sign(payload, getAuthSecret(), {
		expiresIn: "15m",
	});
};

export const createRefreshToken = (payload: payload): string => {
	return jwt.sign(payload, getRefreshSecret(), {
		expiresIn: "7d",
	});
};

export const createResetToken = (payload: payload): string => {
	return jwt.sign(payload, getResetSecret(), {
		expiresIn: "1d",
	});
};

export const GetPasswordResetToken = async (email: string) => {
	const user = await User.findOne({ email });
	if (!user) {
		return { code: 400, message: "user not found" };
	}
	const payload: payload = {
		userId: user.id,
		email: email,
	};
	const token = createResetToken(payload);
	return { code: 200, message: "success", data: { token } };
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

export const login = async (email: string, password: string): Promise<AuthResult> => {
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
	if (await user.validPassword(password)) {
		const token = createAuthToken({ userId: user._id, email });
		const refresh_token = createRefreshToken({
			userId: user._id,
			email,
			tokenVersion: user.tokenVersion,
		});

		return {
			code: 200,
			success: true,
			message: "Valid Sign in",
			token: token,
			refresh_token,
			userId: user._id,
		};
	} else {
		return { success: false, code: 401, message: "Invalid Email or Password" };
	}
};

export const setRefreshToken = (context: Context, authResult: AuthResult): void => {
	if (authResult.code !== 200 || authResult.refresh_token == undefined) {
		throw new Error(`Error ${authResult.code}: ${authResult.message}`);
	}

	context.setCookies.push({
		name: "refresh_token",
		value: authResult.refresh_token,
		options: {
			httpOnly: true,
			path: "/refresh_token",
		},
	});
};

export const register = async (
	username: string,
	email: string,
	password: string,
	photo?: string
): Promise<AuthResult> => {
	const result = validateCredentials({ email, password, username }, true);
	if (!result.success) return result;

	email = email.toLowerCase();
	const newUser = new User({ username, email, photo: photo || "/avatar.png" });
	newUser.password = await newUser.generateHash(password);
	await newUser.save();

	const token = createAuthToken({ userId: newUser._id, email });
	const refresh_token = createRefreshToken({
		userId: newUser._id,
		email,
		tokenVersion: newUser.tokenVersion,
	});

	createPage(newUser.id)

	return {
		code: 200,
		success: true,
		message: "Valid Register",
		token: token,
		refresh_token,
		userId: newUser.id,
	};
};

export const googleAuth = async (token: string) => {
	const ticket = await googleClient.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID,
	});
	const payload = ticket.getPayload();

	if (!payload) throw new Error("Missing user");

	console.log(`User: ${payload.name} verified`);

	const { sub: userId, email, name, picture } = payload;

	const filename = get_image_filename("png");

	await downloadFile(picture!, filename);

	return {
		userId,
		email,
		username: name,
		photo: filename,
	};
};
