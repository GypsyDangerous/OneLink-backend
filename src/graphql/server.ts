import { typeDefs, resolvers, context } from "./index";
import { ApolloServer } from "apollo-server-express";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";

const server = new ApolloServer({ typeDefs, resolvers, context, plugins: [httpHeadersPlugin] });

export default server;
