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
	input LinkBody{
		path: String!,
		embed: Boolean,
		image: String,
		name: String!,
		order: Int!,
		color: String!,
		active: Boolean!
		id: String
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
		me: User,
		page(name: String!): Page
	}
	type Mutation {
		login (email: String!, password: String!): AuthResult,
		logout: Boolean
		register (username: String!, email: String!, password: String!): AuthResult 
		updateUserProfile (username: String, email: String, password: String, photo: String, bio: String, phone: String ): User
		createPage: Page,
		addLink(link: LinkBody): Page,
		addLinks(links: [LinkBody]): Page,
		updateLink(link: LinkBody): Page
		updatePage(theme: String, linkCount: Int): Page
	}
`;
