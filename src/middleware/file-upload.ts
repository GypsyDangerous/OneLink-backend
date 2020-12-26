import multer from "multer";
import {get_image_filename} from "../utils/functions"
import fs from "fs"
import { upload_path } from "../utils/constants";
import {MimeTypeMap} from "../utils/constants"


const fileUpload = multer({
	limits:{
        fileSize: 1024 * 1024
    },
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			if (!fs.existsSync(upload_path)) {
				fs.mkdirSync(upload_path, { recursive: true });
			}
			callback(null, upload_path);
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
