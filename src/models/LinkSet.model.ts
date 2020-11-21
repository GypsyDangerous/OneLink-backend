import mongoose, { Schema } from "mongoose";
import {LinkSet} from "../types/LinkSet"


const LinkSetSchema = new Schema(
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

const LinkSet = mongoose.model<LinkSet>("linkset", LinkSetSchema);

export = LinkSet 
