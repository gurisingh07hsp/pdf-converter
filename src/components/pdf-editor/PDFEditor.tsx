"use client";

import React, { useState, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  Type, 
  Link as LinkIcon, 
  FileCheck, 
  Image as ImageIcon, 
  PenTool, 
  Eraser, 
  MousePointer2, 
  Shapes, 
  Undo2, 
  Bold, 
  Italic, 
  Type as TypeIcon,
  Trash2,
  Move
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFEditorProps {
  file: File;
}

export default function PDFEditor({ file }: PDFEditorProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      width: 600,
      height: 800,
    });
    
    setCanvas(fabricCanvas);

    // Event listeners for contextual toolbar
    fabricCanvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        updateToolbarPosition(e.selected[0]);
        setSelectedObject(e.selected[0]);
      }
    });

    fabricCanvas.on('selection:updated', (e) => {
      if (e.selected && e.selected[0]) {
        updateToolbarPosition(e.selected[0]);
        setSelectedObject(e.selected[0]);
      }
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    fabricCanvas.on('object:moving', (e) => {
      if (e.target) updateToolbarPosition(e.target);
    });

    const updateToolbarPosition = (obj: fabric.Object) => {
      const pointer = obj.getBoundingRect();
      setToolbarPosition({
        top: pointer.top - 50, // Position above the object
        left: pointer.left + pointer.width / 2
      });
    };
    
    // Cleanup function to dispose of the canvas properly
    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [pageNumber]);

  // Toolbar Actions
  const addText = () => {
    if (canvas) {
      const text = new fabric.IText('Double click to edit', {
        left: 100,
        top: 100,
        fontSize: 20,
        fontFamily: 'Plus Jakarta Sans',
        fill: '#111111',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  const updateTextStyle = (style: string, value: any) => {
    if (canvas && selectedObject && selectedObject.type === 'i-text') {
      const textObj = selectedObject as fabric.IText;
      textObj.set(style as any, value);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    if (canvas && selectedObject) {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const addWhiteout = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: '#ffffff',
        width: 150,
        height: 30,
        stroke: '#e5e7eb',
        strokeWidth: 1,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    }
  };

  const addRect = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'rgba(232, 80, 42, 0.2)',
        width: 100,
        height: 50,
        stroke: '#E8502A',
        strokeWidth: 2,
      });
      canvas.add(rect);
    }
  };

  const toggleDrawing = () => {
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = '#E8502A';
        canvas.freeDrawingBrush.width = 3;
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-surface">
      {/* Main Toolbar */}
      <div className="h-14 bg-white border-b border-border-custom flex items-center justify-center px-6 gap-1 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center bg-blue-50/50 rounded-lg p-1 gap-1 border border-blue-100">
          <button onClick={addText} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
            <Type className="w-3.5 h-3.5" /> Text
          </button>
          <div className="w-px h-4 bg-blue-200" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
            <LinkIcon className="w-3.5 h-3.5" /> Links
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
            <FileCheck className="w-3.5 h-3.5" /> Forms
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
            <ImageIcon className="w-3.5 h-3.5" /> Images
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
            <PenTool className="w-3.5 h-3.5" /> Sign
          </button>
          <button onClick={addWhiteout} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
            <Eraser className="w-3.5 h-3.5" /> Whiteout
          </button>
          <button onClick={toggleDrawing} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
            <PenTool className="w-3.5 h-3.5" /> Annotate
          </button>
          <button onClick={addRect} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
            <Shapes className="w-3.5 h-3.5" /> Shapes
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
            <Undo2 className="w-3.5 h-3.5" /> Undo
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Thumbnails */}
        <div className="w-64 bg-white border-r border-border-custom p-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Pages</h3>
          <div className="space-y-4">
            {Array.from(new Array(numPages), (el, index) => (
              <div 
                key={index} 
                onClick={() => setPageNumber(index + 1)}
                className={`aspect-[1/1.4] bg-surface rounded-lg border-2 cursor-pointer transition-all ${pageNumber === index + 1 ? 'border-primary shadow-lg' : 'border-transparent hover:border-gray-200'}`}
              >
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-300">
                  Page {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="grow overflow-auto p-12 flex justify-center bg-gray-100/50" ref={containerRef}>
          <div className="relative shadow-2xl bg-white" style={{ width: 600, height: 800 }}>
            {/* Contextual Toolbar */}
            {selectedObject && (
              <div 
                className="absolute z-50 bg-white border border-blue-200 shadow-xl rounded-lg p-1 flex items-center gap-1 animate-in fade-in zoom-in duration-200"
                style={{ 
                  top: toolbarPosition.top, 
                  left: toolbarPosition.left, 
                  transform: 'translateX(-50%)' 
                }}
              >
                {selectedObject.type === 'i-text' && (
                  <>
                    <button onClick={() => updateTextStyle('fontWeight', 'bold')} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateTextStyle('fontStyle', 'italic')} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-blue-100" />
                    <button onClick={() => updateTextStyle('fontSize', (selectedObject as fabric.IText).fontSize! + 2)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 text-[10px] font-bold">
                      T↑
                    </button>
                    <button onClick={() => updateTextStyle('fontSize', (selectedObject as fabric.IText).fontSize! - 2)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 text-[10px] font-bold">
                      T↓
                    </button>
                  </>
                )}
                <div className="w-px h-4 bg-blue-100" />
                <button onClick={deleteSelected} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="absolute inset-0 z-0">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale} 
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={600}
                />
              </Document>
            </div>
            <div className="absolute inset-0 z-10">
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
