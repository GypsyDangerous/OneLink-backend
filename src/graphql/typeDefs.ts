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
	type AuthResult {
		user: User,
		token: String!
	}
	type Query {
		users: [User]
		user(id: ID!): User
	}
	type Mutation {
		login (email: String!, password: String!): AuthResult
		register (username: String!, email: String!, password: String!): AuthResult 
		update (Authorization: String!, username: String, email: String, password: String, photo: String, bio: String, phone: String ): User
	}
`;
