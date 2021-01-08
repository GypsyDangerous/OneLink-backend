import User from "../../../models/User.model";
import { DocumentQuery } from "mongoose";
import {
	googleAuth,
	hasUniqueEmail,
	login,
	register,
	setRefreshToken,
} from "../../../utils/functions";
import { Context } from "../../../types/Request";

export const auth = {
	googleRegister: async (
		parent: unknown,
		{ token }: { token: string },
		context: Context
	): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
		const { username, email, photo, userId } = await googleAuth(token);
		let AuthResult;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (!(await hasUniqueEmail(email!))) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			AuthResult = await login(email!, userId!);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			AuthResult = await register(username!, email!, userId, photo);
		}

		setRefreshToken(context, AuthResult);

		const user = User.findById(AuthResult.userId);
		return { user, token: AuthResult.token };
	},
	googleLogin: async (
		parent: unknown,
		{ token }: { token: string },
		context: Context
	): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
		const { email, userId, username, photo } = await googleAuth(token);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		let AuthResult;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (!(await hasUniqueEmail(email!))) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			AuthResult = await login(email!, userId!);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			AuthResult = await register(username!, email!, userId, photo);
		}

		setRefreshToken(context, AuthResult);

		const user = User.findById(AuthResult.userId);
		return { user, token: AuthResult.token };
	},

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
	logout: async (parent: unknown, args: unknown, context: Context): Promise<boolean> => {
		setRefreshToken(context, { code: 200, refresh_token: "", message: "", success: true });
		return true;
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
