import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef } from 'react';
import canvasState from '../store/canvasState';
import '../styles/canvas.scss'

const Canvas: FC = observer(() => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        canvasState.listen()
    }, [])

    return (
        <div className='canvas'>
            <canvas 
                width={800} 
                height={500}
                ref={canvasRef}
            />
            <button
                onClick={() => canvasState.clearCanvas()}
                className='collapse'
            >
                Collapse lines
            </button>
        </div>
    );
});

export default Canvas;