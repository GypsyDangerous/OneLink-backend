import request from "supertest";
import Controller from "../src/mongoose"
import app from "../src/app";

const uri = process.env.ATLAS_URI;

if (!uri) {
	throw new Error("Missing mongoose connection string");
}

const mongoose = new Controller(uri)

beforeAll(async () => {
	await mongoose.connect()
})

afterAll(async () => {
	await mongoose.disconnect()
})

test("responds with a not found message", async () => {
	// expect(true).toBe(true)
	// done()
	await request(app)
		.get("/what-is-this-even")
		// .set("Accept", "application/json")
		// .expect("Content-Type", /json/)
		.expect(404);
});

// describe("GET /", () => {
// 	it("responds with a json message", done => {
// 		request(app)
// 			.get("/")
// 			.set("Accept", "application/json")
// 			.expect("Content-Type", /json/)
// 			.expect(
// 				200,
// 				{
// 					message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
// 				},
// 				done
// 			);
// 	});
// });
