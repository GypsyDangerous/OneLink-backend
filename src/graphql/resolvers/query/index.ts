import User from "../../../models/User.model";
import Page from "../../../models/Page.model";
import { DocumentQuery } from "mongoose";

import { Page as PageType } from "../../../types/Page";
import { Context } from "../../../types/Request";
import Analytics from "../../../models/Analytics.model";

import { PublicUser } from "../../../types/User";
import { getPage } from "../../../utils/functions";

export const Query = {
	user: async (parent: unknown, { name }: { name: string }): Promise<PublicUser> => {
		console.log(name)
		const privateUser = await User.findOne({ username: name });

		if (!privateUser) throw new Error(`unknown user: ${name}`);

		return {
			bio: privateUser.bio,
			photo: privateUser.photo,
			username: name,
			id: privateUser._id
		};
	},
	me: async (parent: unknown, args: unknown, context: Context): Promise<any> => {
		if (context.id) {
			const user: any = await User.findById(context.id);
			const page = await getPage(context.id);
			user.Page = page;

			return user;
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
