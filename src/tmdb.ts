import jsdom from "jsdom"
import fetch from "node-fetch"
import * as z from "zod"
import { number } from "zod"

const TmdbMovie = z.object({ id: z.number(), original_title: z.string() })
export type TmdbMovie = z.infer<typeof TmdbMovie>
const TmdbSearchResult = z.object({
    total_results: number(),
    results: z.array(TmdbMovie),
})

const TmdbLink = z.string().transform((s) => Number(s.replace(/^.*\//, "")))

// eslint-disable-next-line import/prefer-default-export
export async function searchTitle(
    title: string,
    apiKey: string,
    year?: number
): Promise<TmdbMovie[]> {
    const url = `https://api.themoviedb.org/3/search/movie?&language=en-US&query=${title}&page=1&include_adult=false${
        year ? `&year=${year}` : ""
    }`
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    })
    const result = await response.json()
    const parsed = TmdbSearchResult.parse(result)
    return parsed.results
}

export async function getWatchList(user: string): Promise<TmdbMovie[]> {
    const url = `https://www.themoviedb.org/u/${user}/watchlist`
    const response = await fetch(url)
    const html = await response.text()
    const dom = new jsdom.JSDOM(html).window.document.body
    const results = dom.querySelectorAll(".card .title div")
    const list: TmdbMovie[] = []
    results.forEach((r) => {
        const href = r.querySelector("a")?.getAttribute("href")
        const original_title = r.querySelector("h2")?.innerHTML
        const id = href ? TmdbLink.parse(href) : undefined
        if (id && original_title) {
            list.push({ id, original_title })
        }
    })
    return list
}
