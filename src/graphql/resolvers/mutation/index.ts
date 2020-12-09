import { auth } from "./auth";
import { user } from "./user";
import { page } from "./page";
import {analytics} from "./analytics"

export const Mutation = {
	...auth,
	...user,
	...page,
	...analytics
};
