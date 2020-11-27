import { Router, Request } from "express";
import LinkSet from "../models/LinkSet.model";
import { Link } from "../types/LinkSet";
import { addLink } from "../utils/functions";
import checkAuth from "../middleware/check-auth";
const router = Router();

router.get("/:username", (req, res, next) => {
	const user = req.params.username;
	const page = LinkSet.findOne({ owner: user });
	if (page) {
		res.json({ code: 200, data: page });
	} else {
		next();
	}
});

router.use(checkAuth);

router.post("/:username/create", async (req, res, next) => {
	const linkset = {
		owner: req.params.username,
	};
	const newLinkSet = new LinkSet(linkset);
	await newLinkSet.save();
	res.json({ code: 200, data: newLinkSet });
});

router.patch("/add", async (req: Request<{ username: string }, unknown, Link>, res, next) => {
	const owner = req.userData.userId;
	if (!owner) return res.status(400).json({ code: 400, message: "Unauthorized" });
	const page = await addLink(owner, req.body);
	res.json({ code: 200, data: page });
});

export = router;
