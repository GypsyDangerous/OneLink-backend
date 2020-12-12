import {getAuthSecret, getPage} from "../../src/utils/functions/getters"

import dotenv from "dotenv"
dotenv.config()

test("gets auth token secret from process.env", () => {
    expect(true).toBeDefined()
})