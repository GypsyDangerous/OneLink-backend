import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

// const middlewares = require("./middlewares");
import { notFound, errorHandler } from "./middleware";
import { upload_path } from "./utils/constants";
import api from "./api";
// const api = require("./api");

const app = express();

if (process.env.DEBUG_MODE === "true") {
	app.use(morgan(process.env.LOGGING_TYPE || "dev"));
}
app.use(helmet());
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI || "";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB database connection successful");
});


app.use(upload_path.substr(1), express.static(upload_path.substr(2)));

app.get("/", (req, res) => {
	res.json({
		message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
	});
});

app.use("/v1", api);

app.use(notFound);
app.use(errorHandler);

export = app;
