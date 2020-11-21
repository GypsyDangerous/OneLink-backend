export interface payload {
	userId?: string;
}

export interface loginResult {
	code: number;
	message: string;
	token?: string;
	userId?: string;
	success: boolean;
}
