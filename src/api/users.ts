import User from "../models/User.model";
import { Response, Router } from "express";
import { hasUniqueEmail } from "../middleware";
import checkAuth from "../middleware/check-auth";
import { updateUser } from "../utils/functions";
const router = Router();
import QRCode from "qrcode";

router.get("/qr/:username", (req, res) => {
	QRCode.toBuffer(`https://www.onelinkapp.xyz/${req.params.username}`, (err, buffer) => {
		res.setHeader("content-type", "image/png");
		res.write(buffer, "binary");
		res.end(null, "binary");
	});
});


router.use(checkAuth);

router.post("/force_logout", async (req, res) => {
	const id = req.userData.userId
	const user = await User.findById(id)
	if(!user) return res.status(400).json({code: 400, message: "user not found"})
	user.tokenVersion += 1
	user.save()
	res.json({code: 200, message: "logout succeeded"})	
})

router.get("/@me", async (req, res, next) => {
	try {
		const userId = req.userData.userId;
		const user = await User.findById(userId);
		res.json(user);
	} catch (err) {
		next(err);
	}
});


router.delete("/delete/@me", async (req, res) => {
	try {
		await User.findOneAndDelete({ uuid: req.userData.userId });
		res.json({code: 200, message: "User Deleted"});
	} catch (err) {
		res.status(500).json({ code: 500, message: "Error: " + err.message });
	}
});

router.patch("/update/@me", hasUniqueEmail, async (req, res: Response) => {
	try {
		const result = await updateUser(req.userData.userId, req.body);
		res.status(result.code).json(result);
	} catch (err) {
		res.status(500).json({ code: 500, message: "Error: " + err.message });
	}
});

export = router;
