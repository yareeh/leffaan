import { expect, test } from "@playwright/test"
import { zonedTimeToUtc } from "date-fns-tz"
import parse from "date-fns/parse"

test("shows are sorted by start time", async ({ page }) => {
    await page.goto("http://localhost:3000/")
    const dateElements = page.locator(".show__startDateTime a")
    const count = await dateElements.count()
    const dates = []
    for (let i = 0; i < count; i++) {
        const dateStr = await dateElements.nth(i).textContent()
        const date = zonedTimeToUtc(
            parse(dateStr!, "d.M.yyyy H:mm", new Date()),
            "Europe/Helsinki"
        )
        dates.push(date)
    }
    for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1].getTime()).toBeLessThanOrEqual(
            dates[i - 1].getTime()
        )
    }
})

test("no past shows are listed", async ({ page }) => {
    await page.goto("http://localhost:3000/")
    const dateElements = page.locator(".show__startDateTime a")
    const dateStr = await dateElements.nth(0).textContent()
    const date = zonedTimeToUtc(
        parse(dateStr!, "d.M.yyyy H:mm", new Date()),
        "Europe/Helsinki"
    )
    expect(date.getTime()).toEqual(
        new Date("2022-02-27T16:30:00.000Z").getTime()
    )
})
