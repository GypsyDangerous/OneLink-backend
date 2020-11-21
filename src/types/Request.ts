import { Request } from "express";

export interface Session{
	userId?: string
}

export interface AuthRequest extends Request{
	userData?: Session
}
