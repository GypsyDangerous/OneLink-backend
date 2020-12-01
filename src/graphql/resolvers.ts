import User from "../models/User.model";
import LinkSet from "../models/LinkSet.model";
import { DocumentQuery } from "mongoose";
import {
	checkUniqueEmail,
	login,
	register,
	updateUser,
	addLink,
	updatePage,
	updateLink,
} from "../utils/functions";
import { UserModification } from "../types/User";
import { LinkSet as Page, Link } from "../types/LinkSet";
import { Context } from "../types/Request";

export const resolvers = {
	Query: {
		users: (): DocumentQuery<User[], User, unknown> => {
			return User.find();
		},
		user: (
			parent: unknown,
			args: unknown,
			context: Context
		): DocumentQuery<User | null, User, unknown> => {
			if (context.id) {
				return User.findById(context.id);
			}else{
				throw new Error("Unauthorized")
			}
		},
		page: (
			parent: unknown,
			{ name }: { name: string }
		): DocumentQuery<Page | null, Page, unknown> => {
			return LinkSet.findOne({ owner: name });
		},
	},
	Mutation: {
		login: async (
			parent: unknown,
			{ email, password }: { email: string; password: string },
			context: Context
		): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
			const AuthResult = await login(email, password);

			if (AuthResult.code !== 200) {
				throw new Error(`Error ${AuthResult.code}: ${AuthResult.message}`);
			}

			context.setCookies.push({
				name: "refresh_token",
				value: AuthResult.refresh_token,
				options: {
					httpOnly: true,
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
				},
			});

			const user = User.findById(AuthResult.userId);
			return { user, token: AuthResult.token };
		},
		updateUserProfile: async (
			parent: unknown,
			{ username, email, password, photo, bio, phone }: UserModification,
			context: { id: string }
		): DocumentQuery<User | null, User, unknown> => {
			const { id } = context;
			if (!id) throw new Error("Unauthorized");
			const result = await updateUser(id, {
				username,
				email,
				password,
				photo,
				bio,
				phone,
			});
			if (result.code !== 200) throw new Error(result.message);
			return User.findById(id);
		},
		createPage: async (
			parent: unknown,
			args: unknown,
			context: { id: string }
		): Promise<Page> => {
			const { id } = context;
			if (!id) throw new Error("Unauthorized");
			const newLinkSet = new LinkSet({ owner: id });
			await newLinkSet.save();
			return newLinkSet;
		},
		addLink: async (
			parent: unknown,
			{ link }: { link: Link },
			context: { id?: string }
		): Promise<Page> => {
			const { id } = context;
			if (!id) throw new Error("Unauthorized");
			return addLink(id, link);
		},
		updateLink: async (
			parent: unknown,
			{ link }: { link: Link },
			context: { id: string }
		): Promise<Page> => {
			const { id } = context;
			if (!id) throw new Error("Unauthorized");
			return updateLink(id, link);
		},
		updatePage: async (
			parent: unknown,
			{ theme, linkCount }: { theme?: string; linkCount?: number },
			context: { id?: string }
		): Promise<Page> => {
			const { id } = context;
			if (!id) throw new Error("Unauthorized");
			return updatePage(id, theme, linkCount);
		},
	},
};
