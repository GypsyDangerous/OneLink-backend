import User from "../models/User.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response, Router } from "express";
import { AuthRequest } from "../types/Request";
import { hasUniqueEmail } from "../middleware";
import { saltRounds } from "../utils/constants";
import checkAuth from "../middleware/check-auth";
import { updateUser } from "../utils/functions";
const router = Router();

router.get("/get/:id", async (req, res, next) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

router.use(checkAuth);

router.delete("/delete/:id", async (req, res) => {
	try {
		await User.findOneAndDelete({ uuid: req.params.id });
		res.json("User Deleted");
	} catch (err) {
		res.status(500).json({ code: 500, message: "Error: " + err.message });
	}
});

router.patch("/update/:id", hasUniqueEmail, async (req: AuthRequest, res: Response) => {
	try {
		const result = await updateUser(req.params.id, req.body);
		res.status(result.code).json(result);
	} catch (err) {
		res.status(500).json({ code: 500, message: "Error: " + err.message });
	}
});

export = router;
