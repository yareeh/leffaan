import { parse } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import jsdom from "jsdom"
import { z } from "zod"
import { Operator, Show } from "./types"

const BioRexJson = z.object({ posts: z.string() })

const operator: Operator = "BioRex"

export function bioRexJsonToDom(json: any): Show[] {
    const html = BioRexJson.parse(json).posts
    const dom = new jsdom.JSDOM(html).window.document.body
    const result: Show[] = []

    const movies = dom.querySelectorAll(".movie-card")
    movies.forEach((m) => {
        const title = m
            .querySelector(".movie-carousel__title")
            ?.innerHTML.trim()!
        const operatorId = m.querySelector("a")?.getAttribute("href")!
        const shows = m.querySelectorAll(".btn-showtime-test")
        shows.forEach((s) => {
            const venue = s
                .querySelector(".movie-carousel__showtime-cinema")
                ?.innerHTML.trim()!
            const theatre = `BioRex ${venue.replaceAll(/[()]/g, "")}`
            const screen = s
                .querySelector(".movie-carousel__showtime-screen")
                ?.firstChild?.nodeValue?.trim()
            const startTimeString = s
                .querySelector(
                    ".all-movies__showtimes__locationtime span.pr-1:not(.movie-carousel__showtime-screen)"
                )
                ?.innerHTML.trim()
                .replace(/^\S*\s/, "")!
            const startTime = zonedTimeToUtc(
                parse(startTimeString, "dd.MM. HH:mm", new Date()),
                "Europe/Helsinki"
            )

            const url = s.getAttribute("href")!
            const show: Show = {
                operator,
                operatorId,
                startTime,
                theatre,
                title,
                url,
                screen,
            }
            result.push(show)
        })
    })
    return result
}
