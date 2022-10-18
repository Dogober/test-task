import { makeAutoObservable } from "mobx";

type canvas = HTMLCanvasElement | null

export class CanvasState {

    canvas?: canvas
    ctx?: CanvasRenderingContext2D | null
    linePoints = 0;
    mouseDown?: boolean;
    startX?: number;
    startY?: number;
    constructor(){
        makeAutoObservable(this)
    }

    setCanvas(canvas: canvas){
        this.canvas = canvas
        this.ctx = canvas?.getContext('2d')
    }
    listen(){
        this.canvas!.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas!.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas!.onmousedown = this.mouseDownHandler.bind(this)
    }
    mouseDownHandler(){
        this.mouseDown = true
    }

    mouseUpHandler(event: any){
        this.startX = event.pageX - event.target.offsetLeft
        this.startY = event.pageY - event.target.offsetTop
        this.mouseDown = false
        if(this.linePoints === 0){  
            this.linePoints += 1    
        } else {
            this.linePoints = 0
        }
    }
    mouseMoveHandler(event: any){
        console.log("move linePoints="+ this.linePoints + " mouseDown="+ this.mouseDown )
        if(this.linePoints === 1 && !this.mouseDown){
            this.ctx?.clearRect(0, 0, 800, 500)
            this.ctx?.beginPath()
            this.ctx?.moveTo(this.startX!, this.startY!)
            this.ctx?.lineTo(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop)
            this.ctx?.stroke()
        }
    }
}

export default new CanvasState()