import { NextFunction, Response } from "express";
import { checkAuth } from "../utils/functions";

import { AuthRequest } from "../types/Request";

module.exports = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const token = req.get("Authorization");
		const payload = await checkAuth(token);
		if (!payload) throw new Error();
		req.userData = payload;
		next();
	} catch (err) {
		return res.json({ success: false, code: 401, message: "Authorization failed" });
	}
};
