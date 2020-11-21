import uid from "uid";
import User from "../models/User.model";
import { payload } from "../types/Auth";
import jwt from "jsonwebtoken";
import fs from "fs";
import request from "request";
import { upload_path } from "../utils/constants";

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
	const secret = process.env.PRIVATE_KEY || "";
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
