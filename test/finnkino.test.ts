import { expect } from "chai"
import { readFileSync } from "fs"
import { finnkinoShowToShow, parseFinnkino } from "../src/finnkino"

describe("finnkino", () => {
    it("can parse test xml", () => {
        parseFinnkino(readFileSync("./test-data/schedule.xml").toString())
    })

    it("can convert them to shows", () => {
        const shows = parseFinnkino(
            readFileSync("./test-data/schedule.xml").toString()
        )
        const show = finnkinoShowToShow(shows[0])
        expect(show).to.deep.equal({
            movie: {
                localTitles: [
                    {
                        lang: "fi",
                        value: "Guled & Nasra",
                    },
                ],
                operatorIds: [
                    {
                        id: 303715,
                        operator: "Finnkino",
                    },
                ],
                operatorUrls: [
                    {
                        operator: "Finnkino",
                        url: "http://www.finnkino.fi/event/303715/title/guled_and_nasra/",
                    },
                ],
                originalTitle: "Guled & Nasra",
                runningTime: 83,
                year: 2021,
            },
            operatorId: 1676827,
            operator: "Finnkino",
            startTime: new Date("2022-02-27T08:30:00.000Z"),
            locationId: 1034,
            theatre: "Kinopalatsi, Helsinki",
            screen: "sali 7",
            showDetails: "2D, somali",
            url: "http://www.finnkino.fi/websales/show/1676827/",
        })
    })
})
