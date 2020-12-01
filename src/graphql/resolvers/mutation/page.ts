import LinkSet from "../../../models/LinkSet.model";
import { addLink, updatePage, updateLink } from "../../../utils/functions";
import { LinkSet as Page, Link } from "../../../types/LinkSet";

export const page = {
	createPage: async (parent: unknown, args: unknown, context: { id: string }): Promise<Page> => {
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
};
