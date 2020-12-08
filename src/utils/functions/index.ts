import fs from "fs";
import request from "request";
import { upload_path } from "../constants";

export const downloadFile = (uri: string, filename: string): Promise<any> => {
	return new Promise((resolve, rej) => {
		request.head(uri, function (err, res) {
			if (process.env.DEBUG_MODE === "true") {
				console.log("content-type:", res.headers["content-type"]);
				console.log("content-length:", res.headers["content-length"]);
			}
			const dir = upload_path;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			request(uri)
				.pipe(fs.createWriteStream(`${dir}/${filename}`))
				.on("close", resolve)
				.on("error", rej)
		});
	});
};

export * from "./auth";
export * from "./getters";
export * from "./validation";
export * from "./modifiers";
