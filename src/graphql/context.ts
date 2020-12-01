import { Request, Response } from "express";
import { Context } from "../types/Request";
import { checkAuth } from "../utils/functions";

export const context = async ({ req, res }: { req: Request; res: Response }): Promise<Context> => {
	const token = req.get("Authorization");
	let id;
	try {
		const authResult = await checkAuth(token);
		id = authResult?.userId;
	} catch (err) {
		console.log(err.message);
	}
	return { id, req, res, setCookies: [], setHeaders: [] };
};
