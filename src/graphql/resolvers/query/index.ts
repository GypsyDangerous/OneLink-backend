import User from "../../../models/User.model";
import Page from "../../../models/Page.model";
import { DocumentQuery } from "mongoose";

import { Page as PageType } from "../../../types/Page";
import { Context } from "../../../types/Request";
import Analytics from "../../../models/Analytics.model";

import {PublicUser} from "../../../types/User"

export const Query = {
	user: async (parent: unknown, { name }: { name: string }): Promise<PublicUser> => {
		const privateUser = await User.findOne({ username: name });

		if (!privateUser) throw new Error("unknown user");

		return {
			bio: privateUser.bio,
			photo: privateUser.photo,
			username: name,
		};
	},
	me: (
		parent: unknown,
		args: unknown,
		context: Context
	): DocumentQuery<User | null, User, unknown> => {
		if (context.id) {
			return User.findById(context.id);
		} else {
			throw new Error("Unauthorized");
		}
	},
	analytics: async (
		parent: unknown,
		args: unknown,
		context: Context
	): DocumentQuery<Analytics | null, Analytics, unknown> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return Analytics.findOne({ owner: id });
	},
	page: (
		parent: unknown,
		{ name }: { name: string }
	): DocumentQuery<PageType | null, PageType, unknown> => {
		return Page.findOne({ owner: name });
	},
};
