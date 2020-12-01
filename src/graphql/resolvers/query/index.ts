import User from "../../../models/User.model";
import LinkSet from "../../../models/LinkSet.model";
import { DocumentQuery } from "mongoose";

import { LinkSet as Page } from "../../../types/LinkSet";
import { Context } from "../../../types/Request";

export const Query = {
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
		} else {
			throw new Error("Unauthorized");
		}
	},
	page: (
		parent: unknown,
		{ name }: { name: string }
	): DocumentQuery<Page | null, Page, unknown> => {
		return LinkSet.findOne({ owner: name });
	},
};
