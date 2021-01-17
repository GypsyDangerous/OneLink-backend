import mongoose, { Schema } from "mongoose";
import { Page } from "../types/Page";

const PageSchema = new Schema(
	{
		owner: { type: String, required: true },
		ownerId: { type: String, required: true },
		links: { type: Array, required: true, default: [] },
		theme: {
			type: Object,
			required: false,
			default: {
				linkStyle: "",
				animationType: "",
				backgroundColor: "#282828",
				linkColor: "#2c4d5a",
			},
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

export = Page;
