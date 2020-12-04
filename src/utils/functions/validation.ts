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

export const validateLength = (value: string, min: number, max: number): boolean => {
	const ToLong = value.length > max;
	const ToShort = value.length < min;

	const invalid = ToLong || ToShort;
	return !invalid;
};

export const validateEmail = (email?: string): boolean => {
	// use infinity as the max because there is no limit to the length of an email
	if (!email || !validateLength(email, emailMin, Infinity)) return false;

	return emailRegex.test(email);
};

export const validatePassword = (password?: string): boolean => {
	return validateLength(password || "", passwordMin, passwordMax);
};

export const validateUsername = (username?: string): boolean => {
	return validateLength(username || "", usernameMin, usernameMax);
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
	const valid = {
		success: true,
		code: 200,
		message: "",
	};
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
	
	if (!checkUsername) return valid;

	if (!validateUsername(username)) {
		return {
			success: false,
			code: 400,
			message: "Error: username is invalid or missing",
		};
	}

	return valid;
};
