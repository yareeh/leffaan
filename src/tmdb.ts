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
    apiKey: string
): Promise<TmdbMovie[]> {
    const response = await fetch(
        "https://api.themoviedb.org/3/search/movie?&language=en-US&query=piemonten&page=1&include_adult=false",
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        }
    )
    const result = await response.json()
    const parsed = TmdbSearchResult.parse(result)
    return parsed.results
}
