import request from "supertest";

import app from "../src/app";

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
