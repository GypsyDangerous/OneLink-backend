import User from "../../../models/User.model";
import { DocumentQuery } from "mongoose";
import { hasUniqueEmail, login, register, setRefreshToken } from "../../../utils/functions";
import { Context } from "../../../types/Request";
import Analytics from "../../../models/Analytics.model";

export const analytics = {
	updateAnalytics: async (
		parent: unknown,
		{
			id,
			newAnalytics: { sessions, uniqueVisitors, clicks, links },
		}: { id: string; newAnalytics: Analytics },
		context: Context
	): DocumentQuery<Analytics | null, Analytics, unknown> => {
		if (!id) throw new Error("Unauthorized");
		const analyticsToModify = await Analytics.findOne({ owner: id });

		if (!analyticsToModify) throw new Error("not found");

		if (sessions) analyticsToModify.sessions = sessions;
		if (uniqueVisitors) analyticsToModify.uniqueVisitors = uniqueVisitors;
		if (clicks) analyticsToModify.clicks = clicks;
		if (links) {
			analyticsToModify.links = links;
			analyticsToModify.markModified("links");
		}
		analyticsToModify.clickThroughRate =
			(analyticsToModify.clicks / analyticsToModify.sessions) * 100;

		await analyticsToModify.save();
		return analyticsToModify;
	},
	incrementCount: async (
		parent: unknown,
		{ linkId, userId: id }: { linkId: string; userId: string },
		context: Context
	): DocumentQuery<Analytics | null, Analytics, unknown> => {
		const analyticsToModify = await Analytics.findOne({ owner: id });

		if (!analyticsToModify) throw new Error("not found");

		analyticsToModify.clicks += 1
		const linkToUpdate = analyticsToModify.links.find(link => link.id === linkId)
		if(!linkToUpdate) throw new Error("invalid link")
		linkToUpdate.clicks+=1

		analyticsToModify.markModified("links")

		analyticsToModify.clickThroughRate =
			(analyticsToModify.clicks / analyticsToModify.sessions) * 100;

		await analyticsToModify.save();
		return analyticsToModify;
	},
};
