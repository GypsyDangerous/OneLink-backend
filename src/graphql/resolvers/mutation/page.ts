import Page from "../../../models/Page.model";
import { addLink, updatePage, updateLink } from "../../../utils/functions";
import { Page as PageType, Link } from "../../../types/Page";

export const page = {
	createPage: async (parent: unknown, args: unknown, context: { id: string }): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		const newPage = new Page({ owner: id });
		await newPage.save();
		return newPage;
	},
	addLink: async (
		parent: unknown,
		{ link }: { link: Link },
		context: { id?: string }
	): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return addLink(id, link);
	},
	updateLink: async (
		parent: unknown,
		{ link }: { link: Link },
		context: { id: string }
	): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return updateLink(id, link);
	},
	updatePage: async (
		parent: unknown,
		{ theme, linkCount }: { theme?: string; linkCount?: number },
		context: { id?: string }
	): Promise<PageType> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		return updatePage(id, theme, linkCount);
	},
};
