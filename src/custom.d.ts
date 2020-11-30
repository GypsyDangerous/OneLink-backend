declare namespace Express {
	export interface Request {
		userData: { userId?: string };
	}
}

declare module "apollo-server-plugin-http-headers";
