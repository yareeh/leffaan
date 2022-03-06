import { expect } from "chai"
import dotenv from "dotenv"
import { searchTitle } from "../src/tmdb"

dotenv.config()
const apiKey = process.env.TMDB_API_KEY!

describe("TMDB", () => {
    it("search", async () => {
        const result = await searchTitle(
            "Piemonten tryffelinmetsästäjät",
            apiKey
        )
        expect(result.length).to.equal(1)
        expect(result[0]).to.deep.equal({
            id: 653762,
            original_title: "The Truffle Hunters",
        })
    })
})
