import { gql } from "apollo-server-express";

export const typeDefs = gql`
	type User{
		bio: String,
		phone: String,
		username: String!,
		email: String!,
		photo: String,
		id: ID!	
	}
	type Link{
		path: String!,
		embed: Boolean,
		image: String,
		name: String!,
		order: Int!,
		color: String!,
		active: Boolean!
	}
	type Page{
		owner: String!,
		links: [Link]!,
		theme: String!,
		linkCount: Int!
	}
	type AuthResult {
		user: User,
		token: String!
	}
	type Query {
		users: [User]
		user(id: ID!): User,
		page(name: String!): Page
	}
	type Mutation {
		login (email: String!, password: String!): AuthResult
		register (username: String!, email: String!, password: String!): AuthResult 
		update (Authorization: String!, username: String, email: String, password: String, photo: String, bio: String, phone: String ): User
	}
`;
