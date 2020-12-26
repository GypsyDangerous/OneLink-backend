import sharp from "sharp";
import { MiddlewareFunction } from "../types/middleware";
import fs from "fs";
import { upload_path } from "../utils/constants";
import path from "path";
import { get_url_extension } from "../utils/functions/getters";
import mime from "mime-types";
const promises = fs.promises;

const imageResize: MiddlewareFunction = async (req, res, next) => {
	try {
		const { width, height } = req.query;
		const pathToFetch = upload_path.substr(2);
		console.log(path.join(pathToFetch, req.path));
		const ext = get_url_extension(req.path);
		if (!ext) throw new Error();
		const content_type = mime.lookup(ext);
		if (!content_type) throw new Error();
		const file = await promises.readFile(path.join(pathToFetch, req.path));
		const resizedImage = sharp(file);
		if (width) resizedImage.resize({ width: Number(width) });
		if (height) resizedImage.resize({ height: Number(height) });
		res.setHeader("content-type", content_type);
		res.write(await resizedImage.toBuffer(), "binary");
		res.end(null, "binary");
	} catch (err) {
		res.status(404).json({ message: "image not found" });
	}
	// next();
};

export default imageResize;
