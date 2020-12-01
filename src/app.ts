import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers, context } from "./graphql";
import httpHeadersPlugin from "apollo-server-plugin-http-headers";
import cookie_parser from "cookie-parser";
import jwt from "jsonwebtoken";
dotenv.config();

// const middlewares = require("./middlewares");
import { notFound, errorHandler } from "./middleware";
import { upload_path } from "./utils/constants";
import api from "./api";
import { payload } from "./types/Auth";
import { createAuthToken, getRefreshSecret } from "./utils/functions";
import User from "./models/User.model";
// const api = require("./api");

const app = express();

if (process.env.DEBUG_MODE === "true") {
	app.use(morgan(process.env.LOGGING_TYPE || "dev"));
}
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookie_parser());

const uri = process.env.ATLAS_URI || "";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB database connection successful");
});

const server = new ApolloServer({ typeDefs, resolvers, context, plugins: [httpHeadersPlugin] });

server.applyMiddleware({ app });

app.use(upload_path.substr(1), express.static(upload_path.substr(2)));

app.get("/", (req, res) => {
	res.json({
		message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
	});
});

app.post("/refresh_token", async (req, res, next) => {
	const token: string = req.cookies["refresh_token"];


	if (!token) {
		return res.status(401).json({ code: 401, message: "missing refresh token" });
	}

	try {
		const payload: payload | string = jwt.verify(token, getRefreshSecret());

		if (typeof payload === "string") throw "bad payload";

		const user = await User.findOne({ _id: payload.userId });

		if (!user) throw "no user";

		res.json({
			code: 200,
			data: { token: createAuthToken({ userId: payload.userId, email: payload.email }) },
		});
	} catch (err) {
		console.log(err.message);
		res.status(401).json({ code: 401, message: "invalid refresh token" });
	}
});

app.use("/v1", api);

app.use(notFound);
app.use(errorHandler);

export = app;
