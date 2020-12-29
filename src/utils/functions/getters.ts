import uid from "uid";
import Page from "../../models/Page.model";
import User from "../../models/User.model";
import { Page as PageType } from "../../types/Page";

export const get_image_filename = (ext: string): string => `photo-${uid(12)}-${uid(12)}.${ext}`;

export const get_url_extension = (url: string): string | null => {
	return url.split(/[#?]/)[0]?.split(".")?.pop()?.trim() || null;
};

export const getPage = async (owner: string): Promise<PageType | null> => {
	const user = await User.findById(owner);
	return await Page.findOne({ owner: user?.username });
};

export const getSecret = (key: string): string => {
	const secret = process.env[key];
	if (!secret) {
		console.log(`JWT ${key} is not set, please set one immediatley`);
		process.exit(1);
	}
	return secret;
};

export const getAuthSecret = (): string => {
	return getSecret("AUTH_SECRET");
};

export const getRefreshSecret = (): string => {
	return getSecret("REFRESH_SECRET");
};

export const getResetSecret = (): string => {
	return getSecret("RESET_SECRET")
}