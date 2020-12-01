import { Request, Response } from "express";

export interface Session {
	userId?: string;
}
export interface UrlBody extends Buffer {
	url: string;
}

export interface Context {
	id?: string;
	req: Request;
	res: Response;
	setCookies: any[];
	setHeaders: any[];
}
