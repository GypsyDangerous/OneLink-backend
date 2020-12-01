import { auth } from "./auth";
import { user } from "./user";
import { page } from "./page";

export const Mutation = {
	...auth,
	...user,
	...page,
};
