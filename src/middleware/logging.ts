import fs, { promises } from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const loggingPath = path.join(__dirname, "../../", "logging");

const logger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const loggingFilePath = path.join(loggingPath, "router.log");
	const oldWrite = res.write;
	const oldEnd = res.end;
	if (!fs.existsSync(loggingPath)) {
		console.log("creating directory");
		await promises.mkdir(loggingPath, { recursive: true });
		await promises.writeFile(loggingFilePath, "");
	}
	const query = req.query;
	const logParams = `params=${Object.keys(query)
		.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k] as string)}`)
		.join("&")} `;

	// eslint-disable-next-line prefer-const

	res.startTime = new Date().getTime();

	res.end = (...restArgs: any) => {
		const loggingString = `${new Date().toLocaleString("en-US", { timeZone: "America/new_york" })}: method=${req.method} path="${
			req.path
		}" ${Object.keys(query).length ? logParams : ""}host=${req.get("host")} origin="${req.get("origin")}" url="${
			req.url
		}" originalUrl="${req.originalUrl}" status=${res.statusCode} duration="${Math.abs(
			res.startTime - new Date().getTime()
		)}ms" protocol=${req.protocol}`;

		promises.appendFile(loggingFilePath, `\n${loggingString}`)

		oldEnd.apply(res, restArgs);
	};

	next();
};

export default logger;
