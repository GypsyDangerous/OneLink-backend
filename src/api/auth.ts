import { Router } from "express";
import { hasUniqueEmail } from "../middleware";
import { googleAuth, login, register } from "../utils/functions";
const router = Router();

router.post("/register", hasUniqueEmail, async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const registerResult = await register(username, email, password);
		res.status(registerResult.code).json(registerResult);
	} catch (err) {
		res.status(500).json({ success: false, code: 500, message: "Error: " + err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { password, email } = req.body;
		const AuthResult = await login(email, password);
		res.status(AuthResult.code).json(AuthResult);
	} catch (err) {
		res.status(500).json({ success: false, code: 500, message: "Error: " + err.message });
	}
});

router.post("/google/register", async (req, res, next) => {
	try {
		const { username, email, photo, userId } = await googleAuth(req.body.token);
		const registerResult = await register(username!, email!, userId, photo);
		res.status(registerResult.code).json(registerResult);
	} catch (err) {
		res.status(500).json({ success: false, code: 500, message: "Error: " + err.message });
	}
});

// router.post("/check_email", (res, req, next) => {

// })

export = router;
