import User from "../../models/User.model";
import {
	passwordMin,
	passwordMax,
	usernameMin,
	usernameMax,
	emailMin,
	emailRegex,
} from "../constants";
import { Credentials, AuthResult } from "../../types/Auth";

export const validateEmail = (email?: string): boolean => {
	// if the email is too short or doesn't exist it is automatically invalid
	if (!email || email.length < emailMin) return false;

	// make sure the email is in the corrent form based on the regex
	return emailRegex.test(email);
};

export const validateLength = (value: string, min: number, max: number): boolean => {
	const ToLong = value.length > max;
	const ToShort = value.length < min;

	const invalid = ToLong || ToShort;
	return !invalid;
};

export const validatePassword = (password?: string): boolean => {
	return validateLength(password || "", passwordMin, passwordMin);
};

export const validateUsername = (username?: string): boolean => {
	return validateLength(username || "", usernameMin, usernameMin);
};

export const hasUniqueEmail = async (email: string): Promise<boolean> => {
	if (!email) return false;

	email = email.toLowerCase();
	return !(await new Promise(res => User.findOne({ email }, (err, data) => res(data))));
};

export const validateCredentials = (
	{ username, email, password }: Credentials,
	checkUsername: boolean
): AuthResult => {
	if (!validatePassword(password)) {
		return {
			success: false,
			code: 400,
			message: "Error: password is invalid or missing",
		};
	}
	if (!validateEmail(email)) {
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
		message: "",
	};
};
