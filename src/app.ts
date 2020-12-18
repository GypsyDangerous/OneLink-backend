import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import cookie_parser from "cookie-parser";
import jwt from "jsonwebtoken";
import server from "./graphql/server";
import User from "./models/User.model";
import api from "./api";
import { notFound, errorHandler } from "./middleware";
import { upload_path } from "./utils/constants";
import { payload } from "./types/Auth";
import { createAuthToken, getRefreshSecret } from "./utils/functions";
import logger from "./middleware/logging";
dotenv.config();

const app = express();

if (process.env.DEBUG_MODE === "true") {
	app.use(morgan(process.env.LOGGING_TYPE || "dev"));
}

app.use(helmet());
app.use(
	cors({
		origin: ["http://localhost:3000", "https://onelinkapp.xyz", "https://www.onelinkapp.xyz"],
		credentials: true,
	})
);
app.use(express.json());
app.use(cookie_parser());

app.use(logger);

app.use((req, res, next) => {
	if(!req.get("origin")) return res.status(401).json({message: "servers aren't allowed"})
	next()
})

server.applyMiddleware({ app, cors: false });

app.use(upload_path.substr(1), express.static(upload_path.substr(2)));

app.get("/", (req, res) => {
	res.json({
		message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
	});
});

app.post("/refresh_token", async (req, res) => {
	const token: string = req.cookies["refresh_token"];

	if (!token) {
		return res.status(401).json({ code: 401, message: "missing refresh token" });
	}

	try {
		const payload: payload | string = jwt.verify(token, getRefreshSecret());

		if (typeof payload === "string") throw new Error("bad payload");

		const user = await User.findOne({ _id: payload.userId });

		if (user?.tokenVersion !== payload.tokenVersion) throw new Error("Old Token");

		if (!user) throw new Error("no user");

		res.json({
			code: 200,
			data: { token: createAuthToken({ userId: payload.userId, email: payload.email }) },
		});
	} catch (err) {
		console.log(err.message);
		res.status(401).json({ code: 401, message: "invalid refresh token: " + err.message });
	}
});

app.use("/v1", api);

app.use(notFound);
app.use(errorHandler);

export = app;
