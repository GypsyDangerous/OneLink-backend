import { Router } from "express";
import LinkSet from "../models/LinkSet.model";

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

router.post("/:username/create", async (req, res, next) => {
	const linkset = {
		owner: req.params.username,
		
	};
	const newLinkSet = new LinkSet(linkset);
	await newLinkSet.save()
	res.json({ code: 200, data: newLinkSet });
});

export = router;
