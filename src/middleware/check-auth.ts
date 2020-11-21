import { NextFunction, Response } from "express";
import { checkAuth } from "../utils/functions";

import { AuthRequest } from "../types/Request";

export = async (req: AuthRequest, res: Response, next: NextFunction) : Promise<void> => {
	try {
		const token = req.get("Authorization");
		const payload = await checkAuth(token);
		if (!payload) throw new Error();
		req.userData = payload;
		next();
	} catch (err) {
		res.status(401).json({ success: false, code: 401, message: "Authorization failed" });
	}
};
