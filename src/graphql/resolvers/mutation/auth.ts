import User from "../../../models/User.model";
import { DocumentQuery } from "mongoose";
import { hasUniqueEmail, login, register, setRefreshToken } from "../../../utils/functions";
import { Context } from "../../../types/Request";

export const auth = {
	login: async (
		parent: unknown,
		{ email, password }: { email: string; password: string },
		context: Context
	): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
		const AuthResult = await login(email, password);

		setRefreshToken(context, AuthResult);

		const user = User.findById(AuthResult.userId);
		return { user, token: AuthResult.token };
	},
	register: async (
		parent: unknown,
		{ username, email, password }: { username: string; email: string; password: string },
		context: Context
	): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
		if (!(await hasUniqueEmail(email))) {
			throw new Error("A user with that email already exists");
		}

		const AuthResult = await register(username, email, password);

		setRefreshToken(context, AuthResult);

		const user = User.findById(AuthResult.userId);
		return { user, token: AuthResult.token };
	},
};
