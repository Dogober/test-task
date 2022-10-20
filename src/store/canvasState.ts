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
    lineAdded: boolean = false

    constructor(){
        makeAutoObservable(this)
    }

    setCanvas(canvas: canvas){
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
            for (let i = 0; i < this.lines.length; i++) {
                this.ctx?.beginPath()
                this.ctx?.moveTo(this.lines[i].firstPoint.x!, this.lines[i].firstPoint.y!)
                this.ctx?.lineTo(this.lines[i].secondPoint.x!, this.lines[i].secondPoint.y!)
                this.ctx?.stroke()
                for (let j = 0; j < this.lines.length; j++) {
                    let inetrsactionPoint = this.findIntersectionPoints(this.lines[i], this.lines[j])
                    if (inetrsactionPoint) {
                        this.ctx?.beginPath()
                        this.ctx?.arc(inetrsactionPoint?.x!, inetrsactionPoint?.y!, 5, 0, Math.PI * 2, true)
                        this.ctx!.fillStyle = 'red'
                        this.ctx?.fill()         
                    }
                }
            }  
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
            if (!this.lineAdded) {
                this.lines.push(lastLineDrawn)
                this.lineAdded = true
            } else {
                this.lines[this.lines.length-1] = lastLineDrawn
            }
            for (let i = 0; i < this.lines.length; i++) {
                this.ctx?.beginPath()
                this.ctx?.moveTo(this.lines[i].firstPoint.x!, this.lines[i].firstPoint.y!)
                this.ctx?.lineTo(this.lines[i].secondPoint.x!, this.lines[i].secondPoint.y!)
                this.ctx?.stroke()
                for (let j = 0; j < this.lines.length; j++) {
                    let inetrsactionPoint = this.findIntersectionPoints(this.lines[i], this.lines[j])
                    if (inetrsactionPoint) {
                        this.ctx?.beginPath()
                        this.ctx?.arc(inetrsactionPoint?.x!, inetrsactionPoint?.y!, 5, 0, Math.PI * 2, true)
                        this.ctx!.fillStyle = 'red'
                        this.ctx?.fill()         
                    }
                }
            }  
        }
    }
    findIntersectionPoints(drawnLine: Line, lastLineDrawn: Line): Point | undefined{
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
        setTimeout(() => {
            clearInterval(intervalId)
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)
            this.lines = []   
            console.log('Stop')
        }, 3000)
        const intervalId = setInterval(() => {
            this.ctx?.clearRect(0, 0, this.canvas?.clientWidth!, this.canvas?.clientHeight!)    
            for (let i = 0; i < this.lines.length; i++) {
                this.lineAnimation(this.lines[i])
                for (let j = 0; j < this.lines.length; j++) {
                    let inetrsactionPoint = this.findIntersectionPoints(this.lines[i], this.lines[j])
                    if (inetrsactionPoint) {
                        this.ctx?.beginPath()
                        this.ctx?.arc(inetrsactionPoint?.x!, inetrsactionPoint?.y!, 5, 0, Math.PI * 2, true)
                        this.ctx!.fillStyle = 'red'
                        this.ctx?.fill()         
                    }
                }
            }
        }, 0)    
    }
    lineAnimation(line: Line){
        let deltaX = Math.round(line.firstPoint.x!-line.secondPoint.x!)
        let deltaY = Math.round(line.firstPoint.y!-line.secondPoint.y!)
        const animationTick = 30
        const animationDuration = 3000
        const count = animationDuration/animationTick
        let xFirstAnimation = line.firstPoint.x!-deltaX/(2*count) 
        let xSecondAnimation = line.secondPoint.x!+deltaX/(2*count)
        let yFirstAnimation = line.firstPoint.y!-deltaY/(2*count)
        let ySecondAnimation = line.secondPoint.y!+deltaY/(2*count)
        line.firstPoint.x = xFirstAnimation
        line.secondPoint.x = xSecondAnimation
        line.firstPoint.y = yFirstAnimation
        line.secondPoint.y = ySecondAnimation
        this.ctx?.beginPath()
        this.ctx?.moveTo(xFirstAnimation, yFirstAnimation)
        this.ctx?.lineTo(xSecondAnimation, ySecondAnimation)
        this.ctx?.stroke()
    }
}
export default new CanvasState()