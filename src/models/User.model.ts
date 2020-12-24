import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { saltRounds } from "../utils/constants";

interface OtherSocial {
	name: string;
	link: string;
}

interface Socials {
	instagram?: string;
	facebook?: string;
	tiktok?: string;
	medium?: string;
	snapchat?: string;
	email?: boolean;
	phone?: boolean;
	twitter?: string;
	others?: OtherSocial[];
}

interface User extends mongoose.Document {
	bio: string;
	phone: string;
	username: string;
	name: string;
	email: string;
	password: string;
	isDeleted?: boolean;
	photo: string;
	social: Socials;
	tokenVersion: number,
	generateHash: (password: string) => string;
	validPassword: (password: string) => boolean;
}

const UserSchema = new Schema(
	{
		socials: {
			type: Object,
			required: true,
			default: {},
		},
		bio: { type: String, required: false, default: "" },
		phone: { type: String, required: false, default: "" },
		name: {
			type: String,
			required: false,
			trim: true,
			default: "",
			// minlength: 3,
		},
		username: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		password: {
			type: String,
			required: false,
			trim: true,
			minlength: 8,
		},
		isDeleted: {
			type: Boolean,
			defualt: false,
		},
		photo: {
			type: String,
			required: false,
			default: "/avatar.png",
		},
		tokenVersion: {
			type: Number,
			required: true,
			default: 0,
		}
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.generateHash = async function (password: string) {
	return bcrypt.hash(password, bcrypt.genSaltSync(saltRounds));
};

UserSchema.methods.validPassword = async function (password: string) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model<User>("user", UserSchema);

export = User;
