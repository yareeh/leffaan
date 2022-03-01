import { render, screen, waitFor } from "@testing-library/react"
import { zonedTimeToUtc } from "date-fns-tz"
import parse from "date-fns/parse"
import { readFileSync } from "fs"
import fetchMock, { enableFetchMocks } from "jest-fetch-mock"
import React from "react"
import App from "./App"
import { setTimeSource } from "./time"

const testDate = new Date("2022-02-27T16:30:00.000Z")
console.log(testDate.toISOString())
enableFetchMocks()
setTimeSource(() => testDate)

beforeEach(() => {
    fetchMock.doMock()
    fetchMock.mockResponse((req) => {
        if (req.url.startsWith("https://www.kinot.fi")) {
            return Promise.resolve({
                status: 200,
                body: readFileSync("./test-data/kinot.fi.json").toString(),
            })
        }
        if (req.url.startsWith("https://www.finnkino.fi")) {
            return Promise.resolve({
                status: 200,
                body: readFileSync("./test-data/schedule.xml").toString(),
            })
        }
        return Promise.resolve("")
    })
})

async function forPageToLoad() {
    render(<App />)
    await waitFor(() =>
        expect(screen.getAllByText(/piemonten/i)[0]).toBeInTheDocument()
    )
}

function getDates() {
    const dateElements = document.querySelectorAll(".show__startDateTime")
    return Array.from(dateElements).map((e, i) => {
        const date = zonedTimeToUtc(
            parse(e.textContent!, "d.M.yyyy H:mm", new Date()),
            "Europe/Helsinki"
        )
        console.log(i, e.textContent, date, testDate)
        return date.getTime()
    })
}
describe("App", () => {
    test("renders app", async () => {
        await forPageToLoad()
        expect(screen.getAllByText(/tennispalatsi/i)[0]).toBeInTheDocument()
        expect(screen.getAllByText(/orion/i)[0]).toBeInTheDocument()
    })

    test("sorts shows by show time", async () => {
        await forPageToLoad()
        const dates = getDates()
        dates.forEach((d, index) => {
            if (index === 0) {
                return
            }
            expect(d).toBeGreaterThanOrEqual(dates[index - 1])
        })
    })

    test("does not list past shows", async () => {
        await forPageToLoad()
        const dates = getDates()
        const timeNow = testDate.getTime()
        dates.forEach((d) => {
            expect(d).toBeGreaterThanOrEqual(timeNow)
        })
    })
})
