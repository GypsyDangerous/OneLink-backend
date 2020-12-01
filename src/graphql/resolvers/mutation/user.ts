import User from "../../../models/User.model";
import { DocumentQuery } from "mongoose";
import { updateUser } from "../../../utils/functions";
import { UserModification } from "../../../types/User";

export const user = {
	updateUserProfile: async (
		parent: unknown,
		{ username, email, password, photo, bio, phone }: UserModification,
		context: { id: string }
	): DocumentQuery<User | null, User, unknown> => {
		const { id } = context;
		if (!id) throw new Error("Unauthorized");
		const result = await updateUser(id, {
			username,
			email,
			password,
			photo,
			bio,
			phone,
		});
		if (result.code !== 200) throw new Error(result.message);
		return User.findById(id);
	},
};
