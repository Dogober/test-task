import { Line } from "../models/Line"

export const decreasedLine = (line: Line): Line => {
    let deltaX = Math.round(line.firstPoint.x-line.secondPoint.x)
    let deltaY = Math.round(line.firstPoint.y-line.secondPoint.y)
    const animationTick = 100
    const animationDuration = 3000
    const count = animationDuration/animationTick
    let decreasedLine = new Line(
        {x: line.firstPoint.x - deltaX / (2 * count), y: line.firstPoint.y - deltaY / (2 * count)},
        {x: line.secondPoint.x + deltaX / (2 * count), y: line.secondPoint.y + deltaY / (2 * count)})
    return decreasedLine
}
