import { Line } from "../models/Line"
import { Point } from "../models/Point"

export const findIntersectionPoint = (drawnLine: Line, lastLineDrawn: Line): Point | undefined => {
    let divisor = ((lastLineDrawn.secondPoint.y-lastLineDrawn.firstPoint.y)*(drawnLine.secondPoint.x-drawnLine.firstPoint.x)-(lastLineDrawn.secondPoint.x-lastLineDrawn.firstPoint.x)*(drawnLine.secondPoint.y-drawnLine.firstPoint.y))
    let factorA = ((lastLineDrawn.secondPoint.x-lastLineDrawn.firstPoint.x)*(drawnLine.firstPoint.y-lastLineDrawn.firstPoint.y)-(lastLineDrawn.secondPoint.y-lastLineDrawn.firstPoint.y)*(drawnLine.firstPoint.x-lastLineDrawn.firstPoint.x))/divisor
    let factorB = ((drawnLine.secondPoint.x-drawnLine.firstPoint.x)*(drawnLine.firstPoint.y-lastLineDrawn.firstPoint.y)-(drawnLine.secondPoint.y-drawnLine.firstPoint.y)*(drawnLine.firstPoint.x-lastLineDrawn.firstPoint.x))/divisor
    let circlePoint: Point = {
        x: Math.round(drawnLine.firstPoint.x+factorA*(drawnLine.secondPoint.x-drawnLine.firstPoint.x)),
        y: Math.round(drawnLine.firstPoint.y+factorA*(drawnLine.secondPoint.y-drawnLine.firstPoint.y))
    }
    if (factorA >= 0 && factorA <= 1 && factorB >= 0 && factorB <= 1) {
        return circlePoint
    }
}
