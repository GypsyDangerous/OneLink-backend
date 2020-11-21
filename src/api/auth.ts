import { Router } from "express";
import { hasUniqueEmail } from "../middleware";
import { login, register } from "../utils/functions";
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
		const loginResult = await login(email, password);
		res.status(loginResult.code).json(loginResult);
	} catch (err) {
		res.status(500).json({ success: false, code: 500, message: "Error: " + err.message });
	}
});

export = router;
