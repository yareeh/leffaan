import { readFileSync } from "fs"
import { kinotShowToShow, parseKinotJson } from "./kinot-fi"

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
        expect(show).toEqual({
            movie: {
                localTitles: [
                    {
                        lang: "fi",
                        value: "Guled & Nasra",
                    },
                ],
                operatorIds: [
                    {
                        id: 29974,
                        operator: "Kinot",
                    },
                ],
                operatorUrls: [
                    {
                        operator: "Kinot",
                        url: "https://cinemaorion.fi/elokuvat/guled-nasra/",
                    },
                ],
            },
            operator: "Kinot",
            startTime: new Date("2022-02-24T11:00:00.000Z"),
            theatre: "Cinema Orion",
            url: "https://cinemaorion.fi/elokuvat/guled-nasra/",
        })
    })
})
