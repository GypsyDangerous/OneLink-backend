import { Router, Request } from "express";
import Page from "../models/Page.model";
import { addLink } from "../utils/functions";
import checkAuth from "../middleware/check-auth";
const router = Router();

router.get("/:username", (req, res, next) => {
	const user = req.params.username;
	const page = Page.findOne({ owner: user });
	if (page) {
		res.json({ code: 200, data: page });
	} else {
		next();
	}
});

router.use(checkAuth);

router.post("/create", async (req, res) => {
	const PageObject = {
		owner: req.userData.userId,
	};
	const newPage = new Page(PageObject);
	await newPage.save();
	res.json({ code: 200, data: newPage });
});

router.patch("/add", async (req: Request, res) => {
	const owner = req.userData.userId;
	if (!owner) return res.status(400).json({ code: 400, message: "Unauthorized" });
	const page = await addLink(owner, req.body);
	res.json({ code: 200, data: page });
});

export = router;
