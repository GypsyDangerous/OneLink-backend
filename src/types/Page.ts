import mongoose from "mongoose";

export interface Link {
	path: string;
	embed?: boolean;
	image?: string;
	name: string;
	order: number;
	color?: string;
	active: boolean;
	id: string
}

export interface Theme {
	linkStyle: string,
	animationType: string,
	backgroundColor: string,
	linkColor: string,
}

export interface Page extends mongoose.Document {
	owner: string;
	links: Link[];
	theme: Theme;
	linkCount: number;
}