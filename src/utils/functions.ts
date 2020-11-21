import uid from "uid";
import User from "../models/User.model";
import jwt from "jsonwebtoken";
import fs from "fs";
import request from "request";
import { loginResult, payload } from "../types/Auth";
import {
	passwordMin,
	passwordMax,
	usernameMin,
	usernameMax,
	emailMin,
	saltRounds,
	upload_path
} from "./constants";
import { UserModification } from "../types/User";
import bcrypt from "bcrypt";
import LinkSet from "../models/LinkSet.model";
import { LinkSet as Page } from "../types/LinkSet";



export const get_image_filename = (ext: string): string => `photo-${uid(12)}-${uid(12)}.${ext}`;

export const validateEmail = (email: string): boolean => {
	// const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	// return re.test(email);
	return !!email;
};

export const checkUniqueEmail = async (email: string): Promise<boolean> => {
	if (!email) {
		return true;
	}
	email = email.toLowerCase();
	return !!(await User.findOne({ email }));
};

export const checkAuth = async (token?: string): Promise<payload | null> => {
	if (!token) {
		return null;
	}
	const secret = process.env.PRIVATE_KEY
	if(!secret) {
		console.log("JWT Private key is not set. please set one immediately")
		process.exit(1)
	}
	const payload: payload | string = jwt.verify(token, secret);
	if (typeof payload === "string") {
		return null;
	} else {
		return payload;
	}
};

export const downloadFile = (uri: string, filename: string, callback: () => void): void => {
	request.head(uri, function (err, res, body) {
		if (process.env.DEBUG_MODE === "true") {
			console.log("content-type:", res.headers["content-type"]);
			console.log("content-length:", res.headers["content-length"]);
		}
		const dir = upload_path;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		request(uri)
			.pipe(fs.createWriteStream(`${dir}/${filename}`))
			.on("close", callback);
	});
};

export const get_url_extension = (url: string): string | null => {
	return url.split(/[#?]/)[0]?.split(".")?.pop()?.trim() || null;
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

export const updateUser = async (
	id?: string,
	{ username, email, password, photo, bio, phone }: UserModification = {}
): Promise<{ message: string; code: number }> => {
	const user = await User.findById(id);
	if (!user) {
		return { code: 400, message: "Invalid user id" };
	}
	if (username) {
		user.username = username;
	}
	if (email) {
		user.email = email;
	}
	if (phone) {
		user.phone = phone;
	}
	if (photo) {
		user.photo = photo;
	}
	if (bio) {
		user.bio = bio;
	}
	if (password) {
		const samePassword = await bcrypt.compare(password, user.password);
		if (!samePassword) {
			user.password = await bcrypt.hash(password, saltRounds);
		}
	}
	await user.save();
	return { code: 200, message: "User update successfully" };
};

export const getPage = (owner: string): Promise<Page> => {
	return new Promise((res, rej) =>
		LinkSet.findOne({ owner }, (err, doc) => {
			if (err) {
				return rej(err);
			}
			if (doc) {
				res(doc);
			}
		})
	);
};