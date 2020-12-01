import User from "../../models/User.model";
import { passwordMin, passwordMax, usernameMin, usernameMax, emailMin } from "../constants";
import {Credentials, AuthResult} from "../../types/Auth"

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
	return !!(await new Promise(res => User.findOne({ email }, (err, data) => res(data))));
};



export const validateCredentials = (
	{ username, email, password }: Credentials,
	checkUsername: boolean
): AuthResult => {
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
	if (checkUsername) {
		if (!username || username.length < usernameMin || username.length > usernameMax) {
			return {
				success: false,
				code: 400,
				message: "Error: username is invalid or missing",
			};
		}
	}
	return {
		success: true,
		code: 200,
		message: ""
	};
};
