import { Request, Response } from "express";

export interface Session {
	userId?: string;
}
export interface UrlBody extends Buffer {
	url: string;
}

export interface Cookie {
	name: string;
	value: string;
	options?: {
		httpOnly?: boolean;
		path?: string;
		expires?: Date | string;
		maxAge?: number;
		sameSite?: boolean;
		secure?: boolean;
	};
}

export interface Header {
	key: string;
	value: string;
}

export interface Context {
	id?: string;
	req: Request;
	res: Response;
	setCookies: Cookie[];
	setHeaders: Header[];
}
