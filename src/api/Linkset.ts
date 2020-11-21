import { Router, Request } from "express";
import uid from "uid";
import LinkSet from "../models/LinkSet.model";
import { Link } from "../types/LinkSet";
import { getPage } from "../utils/functions";
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
	await newLinkSet.save();
	res.json({ code: 200, data: newLinkSet });
});

router.patch(
	"/:username/add",
	async (req: Request<{ username: string }, unknown, Link>, res, next) => {
		const owner = req.params.username;
		const linkSet = await getPage(owner);
		const link = req.body;
		link.id = uid();
		linkSet.links.push(link);
	}
);

export = router;
