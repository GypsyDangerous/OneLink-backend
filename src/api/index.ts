import { Router } from "express";
import fileUpload from "../middleware/file-upload";
import { fileDownload } from "../middleware/download_file";
import auth from "./auth";
import users from "./users";
import pages from "./Page";
import checkAuth from "../middleware/check-auth";

const router = Router();

router.get("/", (req, res) => {
	res.json({ message: "ImShare Api", code: 200 });
});

router.put("/download", fileDownload);

router.post("/upload", fileUpload.single("image"), async (req, res) => {
	res.json({
		code: 200,
		message: "image uploaded successfully",
		data: { imageUrl: req.file.path },
	});
});

router.get("/token/ping", checkAuth, (req, res) => {
	res.json({ code: 200, message: "Token is valid", data: req.userData });
});

router.use("/users", users);
router.use("/auth", auth);
router.use("/page", pages);

export = router;
