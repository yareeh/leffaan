import type { NextApiRequest, NextApiResponse } from "next"
import { finnkinoShowToShow, parseFinnkino } from "../../src/finnkino"
import { kinotShowToShow, parseKinotJson } from "../../src/kinot-fi"
import { mockDate, mockFinnkino, mockKinot } from "../../src/mocks"
import { Show } from "../../src/types"

let getKinot = async () => {
    const response = await fetch(
        "https://www.kinot.fi/wp-json/kinot-shows/v1/shows?limit=3&offset=0&theater=all&date=all"
    )
    return response.json()
}
let getFinnkino = async () => {
    const response = await fetch(
        "https://www.finnkino.fi/xml/Schedule?area=1002"
    )
    return response.text()
}
let timeSource = () => new Date()

if (process.env.LEFFAAN_MODE === "test") {
    getKinot = mockKinot
    getFinnkino = mockFinnkino
    timeSource = mockDate
    console.log("Running in test mode")
}

async function getKinotShows(): Promise<Show[]> {
    const kinotResponse = await getKinot()
    const kinotResult = parseKinotJson(kinotResponse)
    return kinotResult.map(kinotShowToShow)
}

async function getFinnkinoShows(): Promise<Show[]> {
    const finnkinoXml = await getFinnkino()
    const finnkinoShows = parseFinnkino(finnkinoXml)
    return finnkinoShows.map(finnkinoShowToShow)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Show[]>
) {
    const kinotShows = await getKinotShows()
    const finnkinoShows = await getFinnkinoShows()
    const now = timeSource().getTime()
    const allShows = [...kinotShows, ...finnkinoShows]
        .filter((s) => s.startTime.getTime() >= now)
        .sort((s1, s2) => s1.startTime.getTime() - s2.startTime.getTime())

    res.status(200).json(allShows)
}
