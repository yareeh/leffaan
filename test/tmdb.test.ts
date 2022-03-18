import { expect } from "chai"
import { readFileSync } from "fs"
import nock from "nock"
import { searchTitle } from "../src/tmdb"

const apiKey = "my api key"

describe("TMDB", () => {
    it("works with one hit", async () => {
        const scope = nock("https://api.themoviedb.org")
            .get(
                "/3/search/movie?&language=en-US&query=Piemonten%20tryffelinmets%C3%A4st%C3%A4j%C3%A4t&page=1&include_adult=false"
            )
            .reply(
                200,
                JSON.parse(
                    readFileSync("./test-data/tmdb-found.json").toString()
                )
            )
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
    it("works with zero hits", async () => {
        const scope = nock("https://api.themoviedb.org")
            .get(
                "/3/search/movie?&language=en-US&query=asdfqwerty&page=1&include_adult=false"
            )
            .reply(
                200,
                JSON.parse(
                    readFileSync("./test-data/tmdb-not-found.json").toString()
                )
            )
        const result = await searchTitle("asdfqwerty", apiKey)
        expect(result.length).to.equal(0)
    })
    it("works with many hits", async () => {
        const scope = nock("https://api.themoviedb.org")
            .get(
                "/3/search/movie?&language=en-US&query=hamlet&page=1&include_adult=false"
            )
            .reply(
                200,
                JSON.parse(
                    readFileSync("./test-data/tmdb-found-many.json").toString()
                )
            )
        const result = await searchTitle("hamlet", apiKey)
        expect(result.length).to.equal(20)
        expect(result[6]).to.deep.equal({
            id: 8749,
            original_title: "Hamlet liikemaailmassa",
        })
    })
})
