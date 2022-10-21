import { makeAutoObservable } from "mobx";
import { Point } from "../models/Point";
import { Line } from "../models/Line";
import { Circle } from "../models/Circle";
import { decreasedLine } from "../helpers.ts/decreasedLine";
import { findIntersectionPoint } from "../helpers.ts/findIntersectionPoint";

enum LineDrawingState {
    DRAWING_FIRST_POINT,
    DRAWING_SECOND_POINT
}

export class CanvasState {

    canvas?: HTMLCanvasElement | null
    ctx?: CanvasRenderingContext2D | null
    firstX?: number;
    firstY?: number;
    secondX?: number;
    secondY?: number;
    drawingState = LineDrawingState.DRAWING_FIRST_POINT
    lines: Line[] = []
    lineAdded: boolean = false

    constructor(){
        makeAutoObservable(this)
    }

    setCanvas(canvas: HTMLCanvasElement | null){
        this.canvas = canvas
        this.ctx = canvas?.getContext('2d')
    }
    
    listen(){
        this.canvas!.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas!.onclick = this.mouseOnClickHandler.bind(this)
        this.canvas!.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas!.oncontextmenu = this.onContextMenuHandler.bind(this)
    }

    onContextMenuHandler(){
        return false
    }

    mouseDownHandler(event: MouseEvent){
        if (event.button === 2 && this.drawingState === LineDrawingState.DRAWING_SECOND_POINT) {
            this.drawingState = LineDrawingState.DRAWING_FIRST_POINT
            this.lineAdded = false
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)
            this.lines.pop()
            this.drawAll(this.lines)
        }
    }

    mouseOnClickHandler(event: MouseEvent){
        const canvasEvent = event.target as HTMLCanvasElement
        if(this.drawingState === LineDrawingState.DRAWING_FIRST_POINT){
            this.drawingState = LineDrawingState.DRAWING_SECOND_POINT
            this.firstX = event.pageX - canvasEvent.offsetLeft
            this.firstY = event.pageY - canvasEvent.offsetTop
        } else if(this.drawingState === LineDrawingState.DRAWING_SECOND_POINT){
            this.drawingState = LineDrawingState.DRAWING_FIRST_POINT
            this.lineAdded = false
        }
    }

    mouseMoveHandler(event: MouseEvent){
        const canvasEvent = event.target as HTMLCanvasElement
        if(this.drawingState === LineDrawingState.DRAWING_SECOND_POINT){
            this.secondX = event.pageX - canvasEvent.offsetLeft
            this.secondY = event.pageY - canvasEvent.offsetTop
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)
            let lastLineDrawn = new Line(
                {x: this.firstX!, y: this.firstY!}, 
                {x: this.secondX, y: this.secondY})

            if (!this.lineAdded) {
                this.lines.push(lastLineDrawn)
                this.lineAdded = true
            } else {
                this.lines[this.lines.length-1] = lastLineDrawn
            }
            this.drawAll(this.lines)
        }
    }

    collapseLines(){
        setTimeout(() => {
            clearInterval(intervalId)
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)
            this.lines = []   
            console.log('Stop')
        }, 3000)
        const intervalId = setInterval(() => {
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)    
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i] = decreasedLine(this.lines[i])
            }
            this.drawAll(this.lines)
        }, 20)    
    }

    drawCircle(point: Point){
        this.ctx?.beginPath()
        this.ctx?.arc(point.x!, point.y!, 5, 0, Math.PI * 2, true)
        this.ctx!.fillStyle = 'red'
        this.ctx?.fill()
    }

    drawAll(lines: Line[]){
        for (let i = 0; i < lines.length; i++) {
            lines[i].draw(this.canvas!)
            for (let j = 0; j < this.lines.length; j++) {
                let inetrsactionPoint = findIntersectionPoint(lines[i], this.lines[j])
                if (inetrsactionPoint) {
                    let circle = new Circle(inetrsactionPoint)
                    circle.draw(this.canvas!)
                }
            }
        }  
    }
}

export default new CanvasState()