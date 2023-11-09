import React, { useState, useRef,useEffect } from 'react';
import { Stage, Layer, Line, Text} from 'react-konva';

import {io} from 'socket.io-client';
import { jsPDF } from 'jspdf';
import Konva from 'konva';
import html2canvas from 'html2canvas';
import CustomCursor from '../helper/customCursor';
import ReactDOM from 'react-dom';
interface LineData {
  tool: string;
  points: number[];
  color: string;
  width: number;
}

const DrawingCanvas: React.FC = () => {
 
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const [lineHistory, setLineHistory] = useState<LineData[][]>([[]]);
  const [redoHistory, setRedoHistory] = useState<LineData[][]>([]);
  const isDrawing = useRef(false);
  const [drawingColor, setDrawingColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(1);
  const stageRef = useRef<Konva.Stage>(null);
  const containerWidth = window.innerWidth; // Set your desired width
  const containerHeight = window.innerHeight; // Set your desired height
  const [cursorInfo, setCursorInfo] = useState({ x: 0, y: 0, color: '#FF5733', text: 'User 1' });
  const socketRef= useRef(io('http://192.168.0.8:8080/', {
    //withCredentials
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  }));
  useEffect(() => {
    socketRef.current.on('drawing', (data) => {
      setLines([...lines, data]);
    });

    // return () => {
    //   socketRef.current.disconnect();
    // };
  }, [lines]);
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleResize = () => {
    const stage = stageRef.current;
    if (stage) {
      const container = stage.container();
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      container.style.width = containerWidth + 'px';
      container.style.height = containerHeight + 'px';
      stage.width(containerWidth);
      stage.height(containerHeight);
      stage.draw();
    }
  };

  const handleDownload = () => {
    const container = document.getElementById('pdf') as HTMLDivElement;

  html2canvas(container, { scale: 1 }).then((canvas) => {
    const dataURL = canvas.toDataURL();

      const pdf = new jsPDF('landscape');
      pdf.addImage(dataURL, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save('whiteboard.pdf');})
  };

  
  
  const handleColorChange = (color: React.ChangeEvent<HTMLInputElement>) => {
    setDrawingColor(color.target.value);
  };

  const handleLineWidthChange = (width: React.ChangeEvent<HTMLInputElement>) => {
    setLineWidth(Number(width.target.value));
  };

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine: LineData = { tool, points: [pos.x, pos.y], color: drawingColor, width: lineWidth };
    setLines([...lines, newLine]);
    setLineHistory([...lineHistory, [...lines, newLine]]);
    setRedoHistory([]);
    socketRef.current.emit('drawing', newLine);
  };

  const handleMouseMove = (e: any) => {
    const cursorColor = '#FF5733'; // Example color
    const cursorPosition = { x: e.evt.clientX, y: e.evt.clientY };
    setCursorInfo({ x: cursorPosition.x, y: cursorPosition.y, color: cursorColor, text: 'User 1' });
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
    socketRef.current.emit('drawing', lastLine);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    if (lineHistory.length > 1) {
      const updatedHistory = lineHistory.slice(0, -1);
      setRedoHistory([...redoHistory, lineHistory[lineHistory.length - 1]]);
      setLineHistory(updatedHistory);
      setLines(updatedHistory[updatedHistory.length - 1]);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const updatedHistory = [...lineHistory, redoHistory[redoHistory.length - 1]];
      setLineHistory(updatedHistory);
      setLines(updatedHistory[updatedHistory.length - 1]);
      setRedoHistory(redoHistory.slice(0, -1));
    }
  };

  return (
    <div>
      <label htmlFor="drawing-color">Drawing Color:</label>
      <input type="color" id="drawing-color" value={drawingColor} onChange={handleColorChange} />
      <label htmlFor="drawing-line-width">Line Width:</label>
      <input
        type="range"
        id="drawing-line-width"
        min="1"
        max="10"
        value={lineWidth}
        onChange={handleLineWidthChange}
      />
      <button onClick={handleUndo} disabled={lineHistory.length <= 1}>
        Undo
      </button>
      <button onClick={handleRedo} disabled={redoHistory.length === 0}>
        Redo
      </button>
      <button onClick={ handleDownload }> Download PDF</button>
      <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        id="pdf"
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
            />
          ))}
        </Layer>
      </Stage>
      </div>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <div style={{ position: 'absolute', left: cursorInfo.x, top: cursorInfo.y }}>
      <CustomCursor color={cursorInfo.color} text={cursorInfo.text} />
    </div>
    </div>
  );
};

export default DrawingCanvas;
