import classnames from "classnames"
import { formatInTimeZone } from "date-fns-tz"
import { useRouter } from "next/router"
import { NextPage } from "next/types"
import useSWR from "swr"
import { TmdbMovie } from "../src/tmdb"
import { Show } from "../src/types"
import styles from "../styles/Home.module.css"

interface ShowCardProps {
    show: Show
    watchList: boolean
}

function ShowCard(props: ShowCardProps) {
    const { show, watchList } = props

    return (
        <div className={classnames("show", watchList && "watch-list")}>
            <div className="show__title">
                {show.title}
                {/* {s.movie.operatorUrls[0] ? (
            <a href={s.movie.operatorUrls[0]!.url}>
                {s.movie.localTitles[0].value}
            </a>
        ) : (
            <span>{s.movie.localTitles[0].value}</span>
        )} */}
            </div>
            <div className="show__startDateTime">
                <a href={show.url}>
                    {formatInTimeZone(
                        show.startTime,
                        "Europe/Helsinki",
                        "d.M.yyyy H:mm"
                    )}
                </a>
            </div>
            <div className="show__theatre">{show.theatre}</div>
            {show.tmdbId ? (
                <div>
                    <a href={`https://www.themoviedb.org/movie/${show.tmdbId}`}>
                        TMDB
                    </a>
                </div>
            ) : null}
        </div>
    )
}

const fetcher = function <T>(): (url: string) => Promise<T> {
    return async (url: string) => {
        const res = await fetch(url)
        const data = await res.json()

        if (res.status !== 200) {
            console.log("ERROR", JSON.stringify(res))
            throw new Error(data.message)
        }
        console.log("DATA", JSON.stringify(data))
        return data as T
    }
}

const Home: NextPage = () => {
    const { query } = useRouter()
    const { data: shows, error } = useSWR(() => `/api/shows`, fetcher<Show[]>())
    const { data: watchList, error: watchListError } = useSWR(
        () => `/api/watchList`,
        fetcher<TmdbMovie[]>()
    )

    if (error || watchListError) return <div>{error.message}</div>
    if (!shows || !watchList) return <div>Loading...</div>

    const watchListIds = watchList.map((i) => i.id)
    const watchListShows = shows.filter(
        (s) => s.tmdbId && watchListIds.indexOf(s.tmdbId) >= 0
    )
    const otherShows = shows.filter(
        (s) => !s.tmdbId || watchListIds.indexOf(s.tmdbId) < 0
    )

    return (
        <div className={styles.container}>
            <div>
                <h1>Shows</h1>
                {watchListShows.map((s: Show) => (
                    <ShowCard
                        key={`${s.operator}-${s.operatorId}`}
                        show={s}
                        watchList={true}
                    />
                ))}
                {otherShows.map((s: Show) => (
                    <ShowCard
                        key={`${s.operator}-${s.operatorId}`}
                        show={s}
                        watchList={false}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
