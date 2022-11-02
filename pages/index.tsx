import { formatInTimeZone } from "date-fns-tz"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Show } from "../src/types"
import styles from "../styles/Home.module.css"

const fetcher = async (url: string): Promise<Show[]> => {
    const res = await fetch(url)
    const data = await res.json()

    if (res.status !== 200) {
        console.log("ERROR", JSON.stringify(res))
        throw new Error(data.message)
    }
    console.log("DATA", JSON.stringify(data))
    return data as Show[]
}
const Home: NextPage = () => {
    const { query } = useRouter()
    const { data, error } = useSWR(() => `/api/shows`, fetcher)

    if (error) return <div>{error.message}</div>
    if (!data) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <div>
                <h1>Shows</h1>
                {data.map((s: Show) => (
                    <div key={`${s.operator}-${s.operatorId}`} className="show">
                        <div className="show__title">
                            {s.title}
                            {/* {s.movie.operatorUrls[0] ? (
                                <a href={s.movie.operatorUrls[0]!.url}>
                                    {s.movie.localTitles[0].value}
                                </a>
                            ) : (
                                <span>{s.movie.localTitles[0].value}</span>
                            )} */}
                        </div>
                        <div className="show__startDateTime">
                            <a href={s.url}>
                                {formatInTimeZone(
                                    s.startTime,
                                    "Europe/Helsinki",
                                    "d.M.yyyy H:mm"
                                )}
                            </a>
                        </div>
                        <div className="show__theatre">{s.theatre}</div>
                        {s.tmdbId ? (
                            <div>
                                <a
                                    href={`https://www.themoviedb.org/movie/${s.tmdbId}`}
                                >
                                    TMDB
                                </a>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
