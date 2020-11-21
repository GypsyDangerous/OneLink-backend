import mongoose, { Schema } from "mongoose";

interface Link {
	path: string;
	embed?: boolean;
	image?: string;
	name: string;
	order: number;
	color?: string;
	active: boolean;
}

interface LinkSet extends mongoose.Document {
	owner: string;
	links: Link[];
	theme: string;
	linkCount: number;
}

const LinkSetSchema = new Schema(
	{
		owner: { type: String, required: true },
		phone: { type: Array, required: true, default: [] },
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

const User = mongoose.model<LinkSet>("linkset", LinkSetSchema);

export = User;
