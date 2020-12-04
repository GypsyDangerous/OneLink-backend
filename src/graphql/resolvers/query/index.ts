import User from "../../../models/User.model";
import Page from "../../../models/Page.model";
import { DocumentQuery } from "mongoose";

import { Page as PageType } from "../../../types/Page";
import { Context } from "../../../types/Request";

export const Query = {
	// users: (): DocumentQuery<User[], User, unknown> => {
	// 	return User.find();
	// },
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
