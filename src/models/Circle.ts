import { Drawable } from "./Drawable"
import { Point } from "./Point"

export class Circle implements Drawable{
    point: Point
    constructor(point: Point){
        this.point = point
    }
    draw(canvas: HTMLCanvasElement | null): void {
        const ctx = canvas?.getContext('2d')
        ctx?.beginPath()
        ctx?.arc(this.point.x!, this.point.y!, 5, 0, Math.PI * 2, true)
        ctx!.fillStyle = 'red'
        ctx?.fill()
    }
}