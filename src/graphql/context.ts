import { Request } from "express";
import { checkAuth } from "../utils/functions";

export const context = async ({ req }: { req: Request }): Promise<any> => {
	const token = req.headers.authorization || '';
	const authResult = await checkAuth(token);
	const id = authResult?.userId;
	return {id}
};
