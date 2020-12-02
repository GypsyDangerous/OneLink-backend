import { Request, Response, NextFunction } from "express";
import { hasUniqueEmail as emailIsUnique } from "../utils/functions";

export function notFound(req: Request, res: Response): void {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
	});
}

/* eslint-disable no-unused-vars */
export function errorHandler(err: Error, req: Request, res: Response): void {
	/* eslint-enable no-unused-vars */
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
	});
}

export const hasUniqueEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const uniqueEmail = await emailIsUnique(req.body.email);
		if (uniqueEmail) {
			return next();
		}
		res.status(400).json({ code: 400, message: "A user with that email already exists" });
	} catch (err) {
		res.status(400).json({ success: false, code: 400, message: "Error: " + err.message });
	}
};
