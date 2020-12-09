import User from "../../../models/User.model";
import { DocumentQuery } from "mongoose";
import { hasUniqueEmail, login, register, setRefreshToken } from "../../../utils/functions";
import { Context } from "../../../types/Request";
import Analytics from "../../../models/Analytics.model";

export const analytics = {
	updateAnalytics: async (
		parent: unknown,
		{ newAnalytics: { sessions, uniqueVisitors, clicks, links } }: { newAnalytics: Analytics },
		context: Context
	): DocumentQuery<Analytics | null, Analytics, unknown> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		const analyticsToModify = await Analytics.findOne({ owner: id });

		if (!analyticsToModify) throw new Error("not found");

		if (sessions) analyticsToModify.sessions = sessions;
		if (uniqueVisitors) analyticsToModify.uniqueVisitors = uniqueVisitors;
		if (clicks) analyticsToModify.clicks = clicks;
		if (links) {
			analyticsToModify.links = links;
            analyticsToModify.markModified("links")
        }
		analyticsToModify.clickThroughRate =
			(analyticsToModify.clicks / analyticsToModify.sessions) * 100;

		await analyticsToModify.save();
		return analyticsToModify;
	},
};
