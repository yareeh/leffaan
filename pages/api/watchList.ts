import type { NextApiRequest, NextApiResponse } from "next"
import { getWatchList, TmdbMovie } from "../../src/tmdb"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TmdbMovie[]>
) {
    if (process.env.LEFFAAN_MODE === "test") {
        return res.status(200).json([])
    }
    const watchList = await getWatchList("yareeh")
    res.status(200).json(watchList)
}
