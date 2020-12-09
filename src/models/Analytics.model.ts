import mongoose, { Schema } from "mongoose";

interface LinkAnalytic {
	id: string,
	clicks: number
}

interface Analytics extends mongoose.Document {
	owner: string,
	sessions: number,
	uniqueVisitors: number,
	clicks: number,
	clickThroughRate: number,
	links: LinkAnalytic[]
}

const AnalyticsModel = new Schema(
	{
		owner: {
			type: String,
			required: true,
		},
		sessions : {
			type: Number,
			default: 0,
		},
		uniqueVisitors : {
			type: Number,
			default: 0,
		},
		clicks : {
			type: Number,
			default: 0
		},
		clickThroughRate:{
			type: Number,
			default: 0
		},
		links: {
			type: Array,
			default: []
		}
	},
	{
		timestamps: true,
	}
);

const Analytics = mongoose.model<Analytics>("analytics", AnalyticsModel);

export = Analytics;
