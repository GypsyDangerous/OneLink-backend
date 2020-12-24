import { gql } from "apollo-server-express";

export const typeDefs = gql`
	type User {
		bio: String
		phone: String
		username: String!
		email: String!
		photo: String
		id: ID!
		Page: Page
	}
	type Link {
		path: String!
		embed: Boolean
		image: String
		name: String!
		order: Int!
		color: String!
		active: Boolean!
		id: ID!
	}
	input LinkBody {
		path: String!
		embed: Boolean
		image: String
		name: String!
		order: Int!
		color: String!
		active: Boolean!
		id: String
	}
	type Page {
		owner: String!
		links: [Link]!
		theme: String!
		linkCount: Int!
	}
	type LinkAnalytic {
		id: ID!
		clicks: Int!
	}
	input LinkAnalyticModifier {
		id: ID!
		clicks: Int!
	}
	input AnalyticsModifier {
		sessions: Int
		uniqueVisitors: Int
		clicks: Int
		links: [LinkAnalyticModifier]
	}
	type Analytics {
		owner: String
		sessions: Int!
		uniqueVisitors: Int!
		clicks: Int!
		clickThroughRate: Int!
		links: [LinkAnalytic]
	}
	type AuthResult {
		user: User
		token: String!
	}
	type PublicUser {
		bio: String
		username: String!
		photo: String!
	}
	type Query {
		me: User
		analytics: Analytics
		page(name: String!): Page
		user(name: String!): PublicUser
	}
	type Mutation {
		login(email: String!, password: String!): AuthResult
		logout: Boolean
		register(username: String!, email: String!, password: String!): AuthResult
		updateUserProfile(
			username: String
			email: String
			password: String
			photo: String
			bio: String
			phone: String
		): User
		createPage: Page
		addLink(link: LinkBody): Page
		addLinks(links: [LinkBody]): Page
		updateLink(link: LinkBody): Page
		updatePage(theme: String, linkCount: Int): Page
		updateAnalytics(id: ID!, newAnalytics: AnalyticsModifier): Analytics
		incrementCount(linkId: ID!, userId: ID!): Analytics
	}
`;
