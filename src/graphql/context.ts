import { Request, Response } from "express";
import { checkAuth } from "../utils/functions";

export const context = async ({ req, res }: { req: Request; res: Response }): Promise<any> => {
	const token = req.headers.authorization || "";
	const authResult = await checkAuth(token);
	const id = authResult?.userId;
	return { id, req, res, setCookies: [], setHeaders: [] };
};
