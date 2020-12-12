import request from "supertest";
import Controller from "../src/mongoose";
import app from "../src/app";

const uri = process.env.ATLAS_URI;

// if (!uri) {
// 	throw new Error("Missing mongoose connection string");
// }

const mongoose = new Controller(uri || "");

beforeAll(async () => {
	try {
		await mongoose.connect();
	} catch (err) {
		console.log("err");
	}
});

afterAll(async () => {
	try {
		await mongoose.disconnect();
	} catch (err) {
		console.log("error");
	}
});

test("responds with a not found message", async () => {
	await request(app)
		.get("/what-is-this-even")
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(404);
});

describe("GET /", () => {
	it("responds with a json message", done => {
		request(app)
			.get("/")
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(
				200,
				{
					message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
				},
				done
			);
	});
});
