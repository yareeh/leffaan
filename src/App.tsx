import { format } from "date-fns-tz"
import React, { useCallback, useEffect, useState } from "react"
import "./App.css"
import { finnkinoShowToShow, parseFinnkino } from "./finnkino"
import { kinotShowToShow, parseKinotJson } from "./kinot-fi"
import { Show } from "./types"

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

interface Properties {
    timeSource?: () => Date
}

function App(props: Properties) {
    const { timeSource } = props
    const time = timeSource || (() => new Date())

    const [shows, showsSet] = useState<Show[]>([])

    const getShows = useCallback(async () => {
        const kinotShows = await getKinotShows()
        const finnkinoShows = await getFinnkinoShows()
        const now = time().getTime()
        const allShows = [...kinotShows, ...finnkinoShows]
            .filter((s) => s.startTime.getTime() >= now)
            .sort((s1, s2) => s1.startTime.getTime() - s2.startTime.getTime())
        const log = allShows
            .map(
                (s, i) =>
                    `${i} ${s.movie.localTitles[0].value} ${s.theatre} ${s.startTime}`
            )
            .join("\n")
        console.log(log)
        showsSet(allShows)
    }, [])

    useEffect(() => {
        getShows()
    }, [getShows])

    return (
        <div className="App">
            <div>
                <h1>Shows</h1>
                {shows.map((s) => (
                    <div key={`${s.operator}-${s.operatorId}`} className="show">
                        <div className="show__title">
                            {s.movie.operatorUrls[0] ? (
                                <a href={s.movie.operatorUrls[0]!.url}>
                                    {s.movie.localTitles[0].value}
                                </a>
                            ) : (
                                <span>{s.movie.localTitles[0].value}</span>
                            )}
                        </div>
                        <div className="show__startDateTime">
                            <a href={s.url}>
                                {format(s.startTime, "d.M.yyyy H:mm", {
                                    timeZone: "Europe/Helsinki",
                                })}
                            </a>
                        </div>
                        <div className="show__theatre">{s.theatre}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
