import { Request } from "express";

export interface Session{
	userId?: string
}

export interface AuthRequest extends Request{
	userData?: Session
}

export interface UrlBody extends Buffer{
	url: string
}