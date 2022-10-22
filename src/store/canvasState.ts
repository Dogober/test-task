import { makeAutoObservable } from "mobx";
import { Line } from "../models/Line";
import { Circle } from "../models/Circle";
import { decreasedLine } from "../helpers.ts/decreasedLine";
import { findAllIntersections } from "../helpers.ts/findAllIntersections";
import { Drawable } from "../models/Drawable";

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
            this.draw(this.lines)
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
            this.draw(this.lines)
        }
    }

    collapseLines() {
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
            this.draw(this.lines)
        }, 20)    
    }

    draw(lines: Line[]) {
        let circles = findAllIntersections(lines).map((point) => new Circle(point))
        let drawables: Drawable[] = []
        drawables = drawables.concat(lines).concat(circles)
        this.drawAll(drawables)
    }

    drawAll(drawables: Drawable[]) {
        for (let i = 0; i < drawables.length; i++) {
            drawables[i].draw(this.canvas!)
        }
    }
}

export default new CanvasState()