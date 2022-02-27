import { render, screen, waitFor } from "@testing-library/react"
import { zonedTimeToUtc } from "date-fns-tz"
import parse from "date-fns/parse"
import { readFileSync } from "fs"
import { enableFetchMocks } from "jest-fetch-mock"
import React from "react"
import App from "./App"

enableFetchMocks()

beforeEach(() => {
    fetchMock.mockIf(/^https:\/\/www.kinot.fi/, () =>
        Promise.resolve({
            status: 200,
            body: readFileSync("./test-data/kinot.fi.json").toString(),
        })
    )
    fetchMock.mockIf(/^https:\/\/www.finnkino.fi/, () =>
        Promise.resolve({
            status: 200,
            body: readFileSync("./test-data/schedule.xml").toString(),
        })
    )
})

describe("App", () => {
    test("renders app", async () => {
        render(<App />)
        await waitFor(() =>
            expect(screen.getAllByText(/piemonten/i)[0]).toBeInTheDocument()
        )
        expect(screen.getAllByText(/tennispalatsi/i)[0]).toBeInTheDocument()
        expect(screen.getAllByText(/orion/i)[0]).toBeInTheDocument()
    })

    test("sorts shows by show time", async () => {
        render(<App />)
        await waitFor(() =>
            expect(screen.getAllByText(/piemonten/i)[0]).toBeInTheDocument()
        )
        const dateElements = document.querySelectorAll(".show__startDateTime")
        const dates = Array.from(dateElements).map((e) =>
            zonedTimeToUtc(
                parse(e.textContent!, "d.M.yyyy H:mm", new Date()),
                "Europe/Helsinki"
            ).getTime()
        )
        dates.forEach((d, index) => {
            if (index === 0) {
                return
            }
            expect(d).toBeGreaterThanOrEqual(dates[index - 1])
        })
    })
})
