import { render, screen, waitFor } from "@testing-library/react"
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

test("renders app", async () => {
    render(<App />)
    await waitFor(() =>
        expect(screen.getAllByText(/piemonten/i)[0]).toBeInTheDocument()
    )
    await waitFor(() =>
        expect(screen.getAllByText(/tennispalatsi/i)[0]).toBeInTheDocument()
    )
    await waitFor(() =>
        expect(screen.getAllByText(/orion/i)[0]).toBeInTheDocument()
    )
})
