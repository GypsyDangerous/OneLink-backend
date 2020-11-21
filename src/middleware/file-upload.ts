import multer from "multer";
import {get_image_filename} from "../utils/functions"
import fs from "fs"
import { upload_path } from "../utils/constants";

const MimeTypeMap: any = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
	"image/svg+xml": "svg",
	"image/gif": "gif",
};

const fileUpload = multer({
	// limits: 500000,
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			const dir = upload_path;
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			callback(null, dir);
		},
		filename: (req, file, callback) => {
			const ext = MimeTypeMap[file.mimetype];
			callback(null, get_image_filename(ext));
		},
	}),
	fileFilter: (req, file, callback) => {
		const isValid = !!MimeTypeMap[file.mimetype];
		const error = isValid ? null : new Error("Invalid File Type");
		if (error) {
			callback(error);
		} else {
			callback(null, isValid);
		}
	},
});

export = fileUpload;
