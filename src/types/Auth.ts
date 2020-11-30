export interface payload {
	userId?: string;
	email?: string
}

export interface loginResult {
	code: number;
	message: string;
	token?: string;
	userId?: string;
	success: boolean;
}
