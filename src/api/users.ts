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

router.get("/get/:id", async (req, res, next) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);
		res.json(user);
	} catch (err) {
		next(err);
	}
});


router.delete("/delete/:id", async (req, res) => {
	try {
		await User.findOneAndDelete({ uuid: req.params.id });
		res.json("User Deleted");
	} catch (err) {
		res.status(500).json({ code: 500, message: "Error: " + err.message });
	}
});

router.patch("/update/:id", hasUniqueEmail, async (req, res: Response) => {
	try {
		const result = await updateUser(req.userData.userId, req.body);
		res.status(result.code).json(result);
	} catch (err) {
		res.status(500).json({ code: 500, message: "Error: " + err.message });
	}
});

export = router;
