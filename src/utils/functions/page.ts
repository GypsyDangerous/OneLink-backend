import Page from "../../models/Page.model";
import {Page as PageType} from "../../types/Page"
import User from "../../models/User.model";


export const createPage = async (id: string) : Promise<PageType> => {
		if (!id) throw new Error("Unauthorized");

		const owner = await User.findById(id);
		if (!owner) throw new Error("Unauthorized");
		const newPage = new Page({ owner: owner.username, ownerId: id });
		await newPage.save();
		return newPage;
}