import fetch from "node-fetch"
import * as z from "zod"
import { number } from "zod"

const TmdbMovie = z.object({ id: z.number(), original_title: z.string() })
type TmdbMovie = z.infer<typeof TmdbMovie>
const TmdbSearchResult = z.object({
    total_results: number(),
    results: z.array(TmdbMovie),
})

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
