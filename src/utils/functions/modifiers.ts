import { saltRounds } from "../constants";
import { UserModification } from "../../types/User";
import bcrypt from "bcrypt";
import { getPage } from "./getters";
import { LinkSet as Page, Link } from "../../types/LinkSet";
import User from "../../models/User.model"
import uid from "uid"

export const updateUser = async (
	id?: string,
	{ username, email, password, photo, bio, phone }: UserModification = {}
): Promise<{ message: string; code: number }> => {
	const user = await User.findById(id);
	if (!user) {
		return { code: 400, message: "Invalid user id" };
	}
	if (username) {
		user.username = username;
	}
	if (email) {
		user.email = email;
	}
	if (phone) {
		user.phone = phone;
	}
	if (photo) {
		user.photo = photo;
	}
	if (bio) {
		user.bio = bio;
	}
	if (password) {
		const samePassword = await bcrypt.compare(password, user.password);
		if (!samePassword) {
			user.password = await bcrypt.hash(password, saltRounds);
		}
	}
	await user.save();
	return { code: 200, message: "User update successfully" };
};

export const addLink = async (owner: string, link: Link): Promise<Page> => {
	const linkSet = await getPage(owner);
	link.id = uid();
	linkSet.links.push(link);
	linkSet.save();
	return linkSet;
};

export const updateLink = async (owner: string, link: Link): Promise<Page> => {
	const linkSet = await getPage(owner);
	const linkIndex = linkSet.links.findIndex(li => li.id === link.id);
	linkSet.links[linkIndex] = link;
	return linkSet;
};

export const updatePage = async (
	owner: string,
	theme?: string,
	linkCount?: number
): Promise<Page> => {
	const linkSet = await getPage(owner);
	if (theme) linkSet.theme = theme;
	if (linkCount) linkSet.linkCount = linkCount;
	return linkSet;
};