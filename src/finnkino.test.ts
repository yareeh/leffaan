import { readFileSync } from "fs"
import { parseFinnkino, finnkinoShowToShow } from "./finnkino"

describe("finnkino", () => {
    it("can parse test xml", () => {
        parseFinnkino(readFileSync("./test-data/schedule.xml").toString())
    })

    it("can convert them to shows", () => {
        const shows = parseFinnkino(
            readFileSync("./test-data/schedule.xml").toString()
        )
        const show = finnkinoShowToShow(shows[0])
        expect(show).toEqual({
            movie: {
                localTitles: [
                    {
                        lang: "fi",
                        value: "Kuolema Niilillä",
                    },
                ],
                operatorIds: [
                    {
                        id: 303523,
                        operator: "Finnkino",
                    },
                ],
                operatorUrls: [
                    {
                        operator: "Finnkino",
                        url: "http://www.finnkino.fi/event/303523/title/kuolema_niilill%C3%A4/",
                    },
                ],
                originalTitle: "Death on the Nile",
                runningTime: 127,
                year: 2020,
            },
            operatorId: 1673976,
            operator: "Finnkino",
            startTime: new Date("2022-02-20T08:30:00.000Z"),
            locationId: 1038,
            theatre: "Tennispalatsi, Helsinki",
            screen: "sali 8",
            showDetails: "2D, englanti",
            url: "http://www.finnkino.fi/websales/show/1673976/",
        })
    })
})
