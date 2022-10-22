import { Drawable } from "./Drawable";
import { Point } from "./Point";

export class Line implements Drawable{
    firstPoint: Point
    secondPoint: Point
    constructor(firstPoint: Point, secondPoint: Point){
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
    }
    draw(canvas: HTMLCanvasElement | null): void {
        const ctx = canvas?.getContext('2d')
        ctx?.beginPath()
        ctx?.moveTo(this.firstPoint.x, this.firstPoint.y)
        ctx?.lineTo(this.secondPoint.x, this.secondPoint.y)
        ctx?.stroke()    
    }
}