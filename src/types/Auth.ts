export interface payload {
	userId?: string;
	email?: string;
	tokenVersion?: number
}

export interface AuthResult {
	code: number;
	message: string;
	token?: string;
	refresh_token?: string;
	userId?: string;
	success: boolean;
}
export interface Credentials {
	username?: string;
	email?: string;
	password?: string;
}
