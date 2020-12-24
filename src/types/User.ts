export interface UserModification {
	username?: string;
	email?: string;
	password?: string;
	photo?: string;
	bio?: string;
	phone?: string;
	Authorization?: string;
}

export interface PublicUser {
	bio: string;
	photo: string;
	username: string;
	id: string
}