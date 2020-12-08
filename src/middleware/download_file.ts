import { Response, Request, NextFunction } from "express";
import {
	get_image_filename,
	downloadFile as download,
	get_url_extension,
} from "../utils/functions";

export const fileDownload = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const { url } = req.body;
	const file_extension = get_url_extension(url);
	if (!file_extension) {
		next(new Error("invalid file url"));
	} else {
		const filename = get_image_filename(file_extension);
		await download(url, filename);
		res.json({ code: 200, message: "file downloaded succesfully", filename });
	}
};
