import type { NextApiRequest, NextApiResponse } from "next"
import { finnkinoShowToShow, parseFinnkino } from "../../src/finnkino"
import { kinotShowToShow, parseKinotJson } from "../../src/kinot-fi"
import { Show } from "../../src/types"

async function getKinotShows(): Promise<Show[]> {
    const response = await fetch(
        "https://www.kinot.fi/wp-json/kinot-shows/v1/shows?limit=3&offset=0&theater=all&date=all"
    )
    const kinotResponse = await response.json()
    const kinotResult = parseKinotJson(kinotResponse)
    return kinotResult.map(kinotShowToShow)
}

async function getFinnkinoShows(): Promise<Show[]> {
    const response = await fetch(
        "https://www.finnkino.fi/xml/Schedule?area=1002"
    )
    const finnkinoXml = await response.text()
    const finnkinoShows = parseFinnkino(finnkinoXml)
    return finnkinoShows.map(finnkinoShowToShow)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Show[]>
) {
    const kinotShows = await getKinotShows()
    const finnkinoShows = await getFinnkinoShows()
    const now = new Date().getTime()
    const allShows = [...kinotShows, ...finnkinoShows]
        .filter((s) => s.startTime.getTime() >= now)
        .sort((s1, s2) => s1.startTime.getTime() - s2.startTime.getTime())

    res.status(200).json(allShows)
}
