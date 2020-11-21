import { NextFunction, Response, Request } from "express";
import { get_image_filename, downloadFile as download } from "../utils/functions";
import {UrlBody} from "../types/Request"

export const fileDownload = async (req: Request<Record<string, unknown>, unknown, UrlBody>, res: Response) : Promise<void> => {
	const {url} = req.body
	const ext = url.split(".").slice(-1)[0].split("?")[0].replace(/[^a-z.]/ig, "")
	const filename = get_image_filename(ext)
	download(url, filename, () => {
		res.json({code: 200, message: "file downloaded succesfully", filename})
	})
};
