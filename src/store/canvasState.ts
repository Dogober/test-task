import { makeAutoObservable } from "mobx";

type canvas = HTMLCanvasElement | null

enum LineDrawingState {
    DRAWING_FIRST_POINT,
    DRAWING_SECOND_POINT
}
interface Line {
    firstPoint: Point;
    secondPoint: Point;
}
interface Point {
    x?: number;
    y?: number;
}

export class CanvasState {

    canvas?: canvas
    ctx?: CanvasRenderingContext2D | null
    firstX?: number;
    firstY?: number;
    secondX?: number;
    secondY?: number;
    drawingState = LineDrawingState.DRAWING_FIRST_POINT
    lines: Line[] = []

    constructor(){
        makeAutoObservable(this)
    }

    setCanvas(canvas: canvas){
        this.canvas = canvas
        this.ctx = canvas?.getContext('2d')
    }
    listen(){
        this.canvas!.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas!.onclick = this.onClick.bind(this)
    }

    onClick(event: any){
        if(this.drawingState === LineDrawingState.DRAWING_FIRST_POINT){
            this.drawingState = LineDrawingState.DRAWING_SECOND_POINT
            this.firstX = event.pageX - event.target.offsetLeft
            this.firstY = event.pageY - event.target.offsetTop
        } else if(this.drawingState === LineDrawingState.DRAWING_SECOND_POINT){
            this.drawingState = LineDrawingState.DRAWING_FIRST_POINT
            this.lines?.push({
                firstPoint: {
                    x: this.firstX,
                    y: this.firstY
                },
                secondPoint: {
                    x: this.secondX,
                    y: this.secondY
                }
            })        
        }

    }
    mouseMoveHandler(event: any){
        if(this.drawingState === LineDrawingState.DRAWING_SECOND_POINT){
            this.secondX = event.pageX - event.target.offsetLeft
            this.secondY = event.pageY - event.target.offsetTop
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)
            this.ctx?.beginPath()
            this.ctx?.moveTo(this.firstX!, this.firstY!)
            this.ctx?.lineTo(this.secondX, this.secondY)
            this.ctx?.stroke()
            if (this.lines.length >= 1) {
                let firstX = this.lines[0].firstPoint.x!
                let secondX = this.lines[0].secondPoint.x!
                let firstY = this.lines[0].firstPoint.y!
                let secondY = this.lines[0].secondPoint.y!
                let divisor = ((this.secondY-this.firstY!)*(secondX-firstX)-(this.secondX-this.firstX!)*(secondY-firstY))
                let factorA = ((this.secondX-this.firstX!)*(firstY-this.firstY!)-(this.secondY-this.firstY!)*(firstX-this.firstX!))/divisor
                let factorB = ((secondX-firstX)*(firstY-this.firstY!)-(secondY-firstY)*(firstX-this.firstX!))/divisor
                let xIntersectionPoint, yIntersectionPoint
                if (factorA >= 0 && factorA <= 1 && factorB >= 0 && factorB <= 1) {
                    xIntersectionPoint = Math.round(firstX+factorA*(secondX-firstX))
                    yIntersectionPoint = Math.round(firstY+factorA*(secondY-firstY))
                    this.ctx?.beginPath()
                    this.ctx?.arc(xIntersectionPoint, yIntersectionPoint, 5, 0, Math.PI * 2, true)
                    this.ctx?.fill()
                }
            }
            for (let i = 0; i < this.lines.length; i++) {
                this.ctx?.beginPath()
                this.ctx?.moveTo(this.lines[i].firstPoint.x!, this.lines[i].firstPoint.y!)
                this.ctx?.lineTo(this.lines[i].secondPoint.x!, this.lines[i].secondPoint.y!)
                this.ctx?.stroke()
            }
        }
    }
    clearCanvas(){
        this.ctx?.clearRect(0, 0, 800, 500)
        this.lines = []
    }
}

export default new CanvasState()