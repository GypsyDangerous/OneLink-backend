import { v1 as uuidv1 } from "uuid";
import jwt from "jsonwebtoken";
import { Router } from "express";
import User from "../models/User.model";
import { hasUniqueEmail } from "../middleware";
import { passwordMin, passwordMax, usernameMin, usernameMax, emailMin } from "../utils/constants";
const router = Router();
 
router.post("/register", hasUniqueEmail, async (req, res, next) => {
	const { username, password } = req.body;
	let { email } = req.body;
	try {
		if (!password || password.length < passwordMin || password.length > passwordMax) {
			return res.status(400).json({
				success: false,
				code: 400,
				message: "Error: password is invalid or missing",
			});
		}
		if (!email || email.length < emailMin) {
			return res.status(400).json({ success: false, code: 400, message: "Error: email is invalid or missing" });
		}
		if (!username || username.length < usernameMin || username.length > usernameMax) {
			return res.status(400).json({
				success: false,
				code: 400,
				message: "Error: username is invalid or missing",
			});
		}

		email = email.toLowerCase();
		const newUser = new User({ username, email });
		newUser.password = newUser.generateHash(password);
		await newUser.save();

		const token = await jwt.sign(
			{ userId: newUser._id, email: email },
			process.env.PRIVATE_KEY || "",
			{
				expiresIn: "1d",
			}
		);

		return res.json({
			success: true,
			message: "Valid Register",
			token: token,
			userId: newUser.id,
		});
	} catch (err) {
		res.status(500).json({ success: false, code: 500, message: "Error: " + err.message });
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { password } = req.body;
		let { email } = req.body;
		console.log(password, password.length)
		// error checking on validity of user inputs,
		// this is to prevent invalid data from getting into the database from users who have tampered with the frontend
		if (!password || password.length < passwordMin || password.length > passwordMax) {
			return res.status(400).json({
				success: false,
				code: 400,
				message: "Error: password is invalid or missing",
			});
		}
		if (!email || email.length < emailMin) {
			return res.status(400).json({ success: false, code: 400, message: "Error: email is invalid or missing" });
		}

		// email should not be case sensitive
		email = email.toLowerCase();

		// get the user by email and see if it exists, if not return an error
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ success: false, code: 401, message: "Invalid Email or Password" });
		}

		// check if the password hash in the database matches the password that was sent in, if not return an error
		if (user.validPassword(password)) {
			const token = await jwt.sign(
				{ userId: user.id, email: email },
				process.env.PRIVATE_KEY || "",
				{
					expiresIn: "1d",
				}
			);

			return res.json({
				success: true,
				message: "Valid Sign in",
				token: token,
				userId: user._id,
			});
		} else {
			return res
				.status(401)
				.json({ success: false, code: 401, message: "Invalid Email or Password" });
		}
	} catch (err) {
		res.status(500).json({ success: false, code: 500, message: "Error: " + err.message });
	}
});

export = router;
