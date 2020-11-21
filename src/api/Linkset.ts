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

router.post("/:username/create", (req, res, next) => {
	const body = req.body;
	const linkset = {
		owner: req.params.username,
		links: [],

	}
});

export = router;
