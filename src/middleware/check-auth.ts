import { NextFunction, Response, Request } from "express";
import { checkAuth } from "../utils/functions";

export = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
