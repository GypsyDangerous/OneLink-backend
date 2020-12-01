import mongoose, { Schema } from "mongoose";
import {Page} from "../types/Page"


const PageSchema = new Schema(
	{
		owner: { type: String, required: true },
		links: { type: Array, required: true, default: [] },
		theme: {
			type: String,
			required: false,
			default: "normal",
		},
		linkCount: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Page = mongoose.model<Page>("Page", PageSchema);

export = Page 
