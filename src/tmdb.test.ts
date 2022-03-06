import dotenv from "dotenv"
import { searchTitle } from "./tmdb"

dotenv.config()
const apiKey = process.env.TMDB_API_KEY!

describe("TMDB", () => {
    test("search", async () => {
        const result = await searchTitle(
            "Piemonten tryffelinmetsästäjät",
            apiKey
        )
        expect(result.length).toBe(1)
        expect(result[0]).toEqual({
            id: 653762,
            original_title: "The Truffle Hunters",
        })
    })
})
