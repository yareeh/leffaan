import { expect } from "chai"
import { readFileSync } from "fs"
import { kinotShowToShow, parseKinotJson } from "../src/kinot-fi"

describe("kinot-fi", () => {
    it("can parse test json", () => {
        const json = JSON.parse(
            readFileSync("./test-data/kinot.fi.json").toString()
        )
        parseKinotJson(json)
    })

    it("can convert kinot.fi shows to shows", () => {
        const shows = parseKinotJson(
            JSON.parse(readFileSync("./test-data/kinot.fi.json").toString())
        )
        const show = kinotShowToShow(shows[0])
        expect(show).to.deep.equal({
            tmdbId: undefined,
            operatorId: 31177,
            title: "Kuolema Niilillä",
            operator: "Kinot",
            startTime: new Date("2022-02-27T15:15:00.000Z"),
            theatre: "Kino Tapiola",
            url: "https://www.kinotapiola.fi/naytos/kuolema-niililla-4/",
        })
    })
})
