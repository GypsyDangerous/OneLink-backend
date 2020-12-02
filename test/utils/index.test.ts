import { get_url_extension, validateCredentials, validateEmail, validatePassword } from "../../src/utils/functions";


describe("Testing get url extension function", () => {
	it("works for links with queries", () => {
		expect(
			get_url_extension(
				"https://cdn.discordapp.com/avatars/193826355266191372/a_be11a0f2a24407b8d12aeed734a7a240.gif?size=128"
			)
		).toBe("gif");
	});
});


describe("Testing crediential validation", () => {
	it("correctly detects a password that is too short", () => {
		const validation = validatePassword("short")
		expect(validation).toBe(false)
	})
	it("correctly detects a password that is too long", () => {
		const validation = validatePassword("adsfadsfklajsd;flkajds;flkasdj;flkasdfja;lskdfadfgsdfgsdfgsdfgsdfgsfdgsdfgdfgsdfgsfdg")
		expect(validation).toBe(false)
	})
	it("correctly detects a valid", () => {
		const validation = validatePassword("Junglecraft6")
		expect(validation).toBe(true)
	})
	it("correctly detects an invalid email", () => {
		const validation = validateEmail("david@g")
		expect(validation).toBe(false)
	})
	it("correctly detects a vaild email", () => {
		const validation = validateEmail("davidgray@gmail.com")
		expect(validation).toBe(true)
	})
	it("works with a valid email and password when not checking username", () => {
		const validation = validateCredentials({email: "davidgraygs4@gmail.com", password: "Junglecraft6"}, false)
		expect(validation.code).toBe(200)
	})
})
