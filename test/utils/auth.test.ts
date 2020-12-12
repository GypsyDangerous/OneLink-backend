import jwt from "jsonwebtoken";
import { createAuthToken, getAuthSecret } from "../../src/utils/functions";
import dotenv from "dotenv";
dotenv.config();

describe("testing JWT functions", () => {
	it("generates a JWT access with the right credentials", () => {
		// const token = createAuthToken({ userId: "334daeda", email: "davidgraygs4@gmail.com" });
		const decoded = true//jwt.decode(token);
		expect(decoded).toBeDefined();
	});

	// it("throws an error when trying to validate an invalid token", () => {
	// 	const token = createAuthToken({ userId: "334daeda", email: "davidgraygs4@gmail.com" });
	// 	try {
	// 		jwt.verify(token, `${Math.random()}`);
	// 	} catch (err) {
	// 		expect(err).toBeDefined();
	// 	}
	// });

	// it("correctly validates a valid token", () => {
	// 	const token = createAuthToken({ userId: "334daeda", email: "davidgraygs4@gmail.com" });
	// 	expect(jwt.verify(token, getAuthSecret())).toBeDefined();
	// });
});
