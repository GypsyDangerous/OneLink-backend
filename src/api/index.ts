import { Router } from "express";
import fileUpload from "../middleware/file-upload";
import { fileDownload } from "../middleware/download_file";
import auth from "./auth";
import users from "./users";
import pages from "./Page";

const router = Router();

router.get("/", (req, res) => {
	res.json({ message: "onelink Api", code: 200 });
});

router.put("/download", fileDownload);

router.post("/upload", fileUpload.single("image"), async (req, res) => {
	res.json({
		code: 200,
		message: "image uploaded successfully",
		data: { imageUrl: req.file.path },
	});
});

router.use("/users", users);
router.use("/auth", auth);
router.use("/page", pages);

export = router;
