let time = () => new Date()

export const timeSource = () => time()
export const setTimeSource = (f: () => Date) => {
    time = f
}
