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
    intersectionPoints: Point[] = []

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
            for (let i = 0; i < this.lines?.length; i++) {
                this.intersectionPoints?.push({
                    x: this.findIntersectionPoints(this.lines[i], this.lines[this.lines?.length-1])?.x,
                    y: this.findIntersectionPoints(this.lines[i], this.lines[this.lines?.length-1])?.y
                })  
            }
            
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
            let lastLineDrawn: Line = {
                firstPoint: {
                    x: this.firstX!,
                    y: this.firstY!
                },
                secondPoint: {
                    x: this.secondX,
                    y: this.secondY
                }
            }
            for (let i = 0; i < this.lines.length; i++) {
                this.ctx?.beginPath()
                this.ctx?.moveTo(this.lines[i].firstPoint.x!, this.lines[i].firstPoint.y!)
                this.ctx?.lineTo(this.lines[i].secondPoint.x!, this.lines[i].secondPoint.y!)
                this.ctx?.stroke()
                this.ctx?.beginPath()
                this.ctx?.arc(this.findIntersectionPoints(this.lines[i], lastLineDrawn)?.x!, this.findIntersectionPoints(this.lines[i], lastLineDrawn)?.y!, 5, 0, Math.PI * 2, true)
                this.ctx!.fillStyle = 'red'
                this.ctx?.fill() 
            }
            for (let i = 0; i < this.intersectionPoints.length; i++) {
                if (this.intersectionPoints[i].x && this.intersectionPoints[i].y) {
                    this.ctx?.beginPath()
                    this.ctx?.arc(this.intersectionPoints[i].x!, this.intersectionPoints[i].y!, 5, 0, Math.PI * 2, true)
                    this.ctx?.fill()     
                }
            }
        }
    }
    findIntersectionPoints(drawnLine: Line, lastLineDrawn: Line){
        let divisor = ((lastLineDrawn.secondPoint.y!-lastLineDrawn.firstPoint.y!)*(drawnLine.secondPoint.x!-drawnLine.firstPoint.x!)-(lastLineDrawn.secondPoint.x!-lastLineDrawn.firstPoint.x!)*(drawnLine.secondPoint.y!-drawnLine.firstPoint.y!))
        let factorA = ((lastLineDrawn.secondPoint.x!-lastLineDrawn.firstPoint.x!)*(drawnLine.firstPoint.y!-lastLineDrawn.firstPoint.y!)-(lastLineDrawn.secondPoint.y!-lastLineDrawn.firstPoint.y!)*(drawnLine.firstPoint.x!-lastLineDrawn.firstPoint.x!))/divisor
        let factorB = ((drawnLine.secondPoint.x!-drawnLine.firstPoint.x!)*(drawnLine.firstPoint.y!-lastLineDrawn.firstPoint.y!)-(drawnLine.secondPoint.y!-drawnLine.firstPoint.y!)*(drawnLine.firstPoint.x!-lastLineDrawn.firstPoint.x!))/divisor
        let circlePoints: Point = {
            x: Math.round(drawnLine.firstPoint.x!+factorA*(drawnLine.secondPoint.x!-drawnLine.firstPoint.x!)),
            y: Math.round(drawnLine.firstPoint.y!+factorA*(drawnLine.secondPoint.y!-drawnLine.firstPoint.y!))
        }
        if (factorA >= 0 && factorA <= 1 && factorB >= 0 && factorB <= 1) {
            return circlePoints
        }
    }
    clearCanvas(){
        this.ctx?.clearRect(0, 0, 800, 500)
        this.lines = []
        this.intersectionPoints = []
    }
}

export default new CanvasState()