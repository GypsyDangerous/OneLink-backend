import { get_url_extension } from "../../src/utils/functions";

describe("Testing get url extension function", () => {
	it("works for links with queries", () => {
		expect(
			get_url_extension(
				"https://cdn.discordapp.com/avatars/193826355266191372/a_be11a0f2a24407b8d12aeed734a7a240.gif?size=128"
			)
		).toBe("gif");
	});
});
