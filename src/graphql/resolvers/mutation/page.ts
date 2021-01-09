import Page from "../../../models/Page.model";
import { addLink, updatePage, updateLink } from "../../../utils/functions";
import { Page as PageType, Link, Theme } from "../../../types/Page";
import User from "../../../models/User.model";
import { Context } from "../../../types/Request";

import {createPage as makePage} from "../../../utils/functions/page"

export const page = {
	createPage: async (parent: unknown, args: unknown, context: Context): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");

		return makePage(id)
	},
	addLink: async (
		parent: unknown,
		{ link }: { link: Link },
		context: Context
	): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return addLink(id, link);
	},
	updateLink: async (
		parent: unknown,
		{ link }: { link: Link },
		context: Context
	): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return updateLink(id, link);
	},
	updatePage: async (
		parent: unknown,
		{ theme, linkCount, links }: { theme?: Theme; linkCount?: number, links: Link[] },
		context: Context
	): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return updatePage(id, theme, linkCount, links);
	},
};
