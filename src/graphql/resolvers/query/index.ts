import User from "../../../models/User.model";
import Page from "../../../models/Page.model";
import { DocumentQuery } from "mongoose";

import { Page as PageType } from "../../../types/Page";
import { Context } from "../../../types/Request";

interface PublicUser {
	bio: string;
	photo: string;
	username: string;
}

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
	page: (
		parent: unknown,
		{ name }: { name: string }
	): DocumentQuery<PageType | null, PageType, unknown> => {
		return Page.findOne({ owner: name });
	},
};
