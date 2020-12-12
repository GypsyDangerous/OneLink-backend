declare namespace Express {
	export interface Request {
		userData: { userId?: string };
	}

	export interface Response {
		startTime: number
	}
}

declare module "apollo-server-plugin-http-headers";
