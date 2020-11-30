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

export const resolvers = {
	Query: {
		users: (): DocumentQuery<User[], User, unknown> => {
			return User.find();
		},
		user: (
			parent: unknown,
			{ id, username }: { id?: string; username?: string }
		): DocumentQuery<User | null, User, unknown> => {
			if (id) {
				return User.findById(id);
			} else {
				return User.findOne({ username });
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
			{ email, password }: { email: string; password: string }
		): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
			const loginResult = await login(email, password);
			if (loginResult.code !== 200)
				throw new Error(`Error ${loginResult.code}: ${loginResult.message}`);
			const user = User.findById(loginResult.userId);
			return { user, token: loginResult.token };
		},
		register: async (
			parent: unknown,
			{ username, email, password }: { username: string; email: string; password: string }
		): Promise<{ token?: string; user: DocumentQuery<User | null, User, unknown> }> => {
			if (await checkUniqueEmail(email))
				throw new Error("A user with that email already exists");
			const loginResult = await register(username, email, password);
			if (loginResult.code !== 200)
				throw new Error(`Error ${loginResult.code}: ${loginResult.message}`);
			const user = User.findById(loginResult.userId);
			return { user, token: loginResult.token };
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
				return updatePage(id, theme, linkCount)
		},
	},
};
