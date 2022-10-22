import { Line } from "../models/Line"
import { Point } from "../models/Point"
import { findIntersectionPoint } from "./findIntersectionPoint"

export const findAllIntersections = (lines: Line[]): Point[] => {
    let points: Point[] = []
    for (let i = 0; i < lines.length; i++) {
        for (let j = i; j < lines.length; j++) {
            let intersectionPoint = findIntersectionPoint(lines[i], lines[j])
            if (intersectionPoint) {
                points.push(intersectionPoint)
            }
        }
    }
    return points
}
