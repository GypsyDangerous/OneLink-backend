import uid from "uid";
import LinkSet from "../../models/LinkSet.model";
import { LinkSet as Page } from "../../types/LinkSet";

export const get_image_filename = (ext: string): string => `photo-${uid(12)}-${uid(12)}.${ext}`;

export const get_url_extension = (url: string): string | null => {
	return url.split(/[#?]/)[0]?.split(".")?.pop()?.trim() || null;
};

export const getPage = (owner: string): Promise<Page> => {
	return new Promise((res, rej) =>
		LinkSet.findOne({ owner }, (err, doc) => {
			if (err) {
				return rej(err);
			}
			if (doc) {
				res(doc);
			}
		})
	);
};