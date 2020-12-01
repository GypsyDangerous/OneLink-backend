import User from "../../../models/User.model";
import { DocumentQuery } from "mongoose";
import { checkUniqueEmail, login, register } from "../../../utils/functions";
import { Context } from "../../../types/Request";

export const auth = {
	login: async (
		parent: unknown,
		{ email, password }: { email: string; password: string },
		context: Context
	): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
		const AuthResult = await login(email, password);

		if (AuthResult.code !== 200 || !AuthResult.refresh_token) {
			throw new Error(`Error ${AuthResult.code}: ${AuthResult.message}`);
		}

		context.setCookies.push({
			name: "refresh_token",
			value: AuthResult.refresh_token,
			options: {
				httpOnly: true,
				path: "/refresh_token",
			},
		});

		const user = User.findById(AuthResult.userId);
		return { user, token: AuthResult.token };
	},
	register: async (
		parent: unknown,
		{ username, email, password }: { username: string; email: string; password: string },
		context: Context
	): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
		if (await checkUniqueEmail(email)) {
			throw new Error("A user with that email already exists");
		}

		const AuthResult = await register(username, email, password);

		if (AuthResult.code !== 200) {
			throw new Error(`Error ${AuthResult.code}: ${AuthResult.message}`);
		}

		context.setCookies.push({
			name: "refresh_token",
			value: AuthResult.refresh_token,
			options: {
				httpOnly: true,
				path: "/refresh_token",
			},
		});

		const user = User.findById(AuthResult.userId);
		return { user, token: AuthResult.token };
	},
};
