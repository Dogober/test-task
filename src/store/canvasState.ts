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
        if(this.drawingState == LineDrawingState.DRAWING_FIRST_POINT){
            this.drawingState = LineDrawingState.DRAWING_SECOND_POINT
            this.firstX = event.pageX - event.target.offsetLeft
            this.firstY = event.pageY - event.target.offsetTop
        } else if(this.drawingState == LineDrawingState.DRAWING_SECOND_POINT){
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
        if(this.drawingState == LineDrawingState.DRAWING_SECOND_POINT){
            this.secondX = event.pageX - event.target.offsetLeft
            this.secondY = event.pageY - event.target.offsetTop
            this.ctx?.clearRect(0, 0, 800, 500)
            this.ctx?.beginPath()
            this.ctx?.moveTo(this.firstX!, this.firstY!)
            this.ctx?.lineTo(this.secondX, this.secondY)
            this.ctx?.stroke()
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
