// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import * as fabric from 'fabric';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { 
//   Type, 
//   Link as LinkIcon, 
//   FileCheck, 
//   Image as ImageIcon, 
//   PenTool, 
//   Eraser, 
//   MousePointer2, 
//   Shapes, 
//   Undo2, 
//   Bold, 
//   Italic, 
//   Type as TypeIcon,
//   Trash2,
//   Move
// } from 'lucide-react';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // Set up PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PDFEditorProps {
//   file: File;
// }

// export default function PDFEditor({ file }: PDFEditorProps) {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1.0);
//   const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
//   const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
//   const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//   }

//   // Initialize Fabric Canvas
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const fabricCanvas = new fabric.Canvas(canvasRef.current, {
//       isDrawingMode: false,
//       width: 600,
//       height: 800,
//     });
    
//     setCanvas(fabricCanvas);

//     // Event listeners for contextual toolbar
//     fabricCanvas.on('selection:created', (e) => {
//       if (e.selected && e.selected[0]) {
//         updateToolbarPosition(e.selected[0]);
//         setSelectedObject(e.selected[0]);
//       }
//     });

//     fabricCanvas.on('selection:updated', (e) => {
//       if (e.selected && e.selected[0]) {
//         updateToolbarPosition(e.selected[0]);
//         setSelectedObject(e.selected[0]);
//       }
//     });

//     fabricCanvas.on('selection:cleared', () => {
//       setSelectedObject(null);
//     });

//     fabricCanvas.on('object:moving', (e) => {
//       if (e.target) updateToolbarPosition(e.target);
//     });

//     const updateToolbarPosition = (obj: fabric.Object) => {
//       const pointer = obj.getBoundingRect();
//       setToolbarPosition({
//         top: pointer.top - 50, // Position above the object
//         left: pointer.left + pointer.width / 2
//       });
//     };
    
//     // Cleanup function to dispose of the canvas properly
//     return () => {
//       fabricCanvas.dispose();
//       setCanvas(null);
//     };
//   }, [pageNumber]);

//   // Toolbar Actions
//   const addText = () => {
//     if (canvas) {
//       const text = new fabric.IText('Double click to edit', {
//         left: 100,
//         top: 100,
//         fontSize: 20,
//         fontFamily: 'Plus Jakarta Sans',
//         fill: '#111111',
//       });
//       canvas.add(text);
//       canvas.setActiveObject(text);
//     }
//   };

//   const updateTextStyle = (style: string, value: any) => {
//     if (canvas && selectedObject && selectedObject.type === 'i-text') {
//       const textObj = selectedObject as fabric.IText;
//       textObj.set(style as any, value);
//       canvas.renderAll();
//     }
//   };

//   const deleteSelected = () => {
//     if (canvas && selectedObject) {
//       canvas.remove(selectedObject);
//       canvas.discardActiveObject();
//       canvas.renderAll();
//     }
//   };

//   const addWhiteout = () => {
//     if (canvas) {
//       const rect = new fabric.Rect({
//         left: 100,
//         top: 100,
//         fill: '#ffffff',
//         width: 150,
//         height: 30,
//         stroke: '#e5e7eb',
//         strokeWidth: 1,
//       });
//       canvas.add(rect);
//       canvas.setActiveObject(rect);
//     }
//   };

//   const addRect = () => {
//     if (canvas) {
//       const rect = new fabric.Rect({
//         left: 100,
//         top: 100,
//         fill: 'rgba(232, 80, 42, 0.2)',
//         width: 100,
//         height: 50,
//         stroke: '#E8502A',
//         strokeWidth: 2,
//       });
//       canvas.add(rect);
//     }
//   };

//   const toggleDrawing = () => {
//     if (canvas) {
//       canvas.isDrawingMode = !canvas.isDrawingMode;
//       if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
//         canvas.freeDrawingBrush.color = '#E8502A';
//         canvas.freeDrawingBrush.width = 3;
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-surface">
//       {/* Main Toolbar */}
//       <div className="h-14 bg-white border-b border-border-custom flex items-center justify-center px-6 gap-1 sticky top-0 z-50 shadow-sm">
//         <div className="flex items-center bg-blue-50/50 rounded-lg p-1 gap-1 border border-blue-100">
//           <button onClick={addText} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
//             <Type className="w-3.5 h-3.5" /> Text
//           </button>
//           <div className="w-px h-4 bg-blue-200" />
//           <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
//             <LinkIcon className="w-3.5 h-3.5" /> Links
//           </button>
//           <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
//             <FileCheck className="w-3.5 h-3.5" /> Forms
//           </button>
//           <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
//             <ImageIcon className="w-3.5 h-3.5" /> Images
//           </button>
//           <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
//             <PenTool className="w-3.5 h-3.5" /> Sign
//           </button>
//           <button onClick={addWhiteout} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
//             <Eraser className="w-3.5 h-3.5" /> Whiteout
//           </button>
//           <button onClick={toggleDrawing} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
//             <PenTool className="w-3.5 h-3.5" /> Annotate
//           </button>
//           <button onClick={addRect} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all">
//             <Shapes className="w-3.5 h-3.5" /> Shapes
//           </button>
//           <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md text-xs font-bold text-blue-600 transition-all opacity-50">
//             <Undo2 className="w-3.5 h-3.5" /> Undo
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar / Thumbnails */}
//         <div className="w-64 bg-white border-r border-border-custom p-4 overflow-y-auto">
//           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Pages</h3>
//           <div className="space-y-4">
//             {Array.from(new Array(numPages), (el, index) => (
//               <div 
//                 key={index} 
//                 onClick={() => setPageNumber(index + 1)}
//                 className={`aspect-[1/1.4] bg-surface rounded-lg border-2 cursor-pointer transition-all ${pageNumber === index + 1 ? 'border-primary shadow-lg' : 'border-transparent hover:border-gray-200'}`}
//               >
//                 <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-300">
//                   Page {index + 1}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Editor Area */}
//         <div className="grow overflow-auto p-12 flex justify-center bg-gray-100/50" ref={containerRef}>
//           <div className="relative shadow-2xl bg-white" style={{ width: 600, height: 800 }}>
//             {/* Contextual Toolbar */}
//             {selectedObject && (
//               <div 
//                 className="absolute z-50 bg-white border border-blue-200 shadow-xl rounded-lg p-1 flex items-center gap-1 animate-in fade-in zoom-in duration-200"
//                 style={{ 
//                   top: toolbarPosition.top, 
//                   left: toolbarPosition.left, 
//                   transform: 'translateX(-50%)' 
//                 }}
//               >
//                 {selectedObject.type === 'i-text' && (
//                   <>
//                     <button onClick={() => updateTextStyle('fontWeight', 'bold')} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                       <Bold className="w-3.5 h-3.5" />
//                     </button>
//                     <button onClick={() => updateTextStyle('fontStyle', 'italic')} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                       <Italic className="w-3.5 h-3.5" />
//                     </button>
//                     <div className="w-px h-4 bg-blue-100" />
//                     <button onClick={() => updateTextStyle('fontSize', (selectedObject as fabric.IText).fontSize! + 2)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 text-[10px] font-bold">
//                       T↑
//                     </button>
//                     <button onClick={() => updateTextStyle('fontSize', (selectedObject as fabric.IText).fontSize! - 2)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 text-[10px] font-bold">
//                       T↓
//                     </button>
//                   </>
//                 )}
//                 <div className="w-px h-4 bg-blue-100" />
//                 <button onClick={deleteSelected} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors">
//                   <Trash2 className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             )}

//             <div className="absolute inset-0 z-0">
//               <Document
//                 file={file}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 className="flex justify-center"
//               >
//                 <Page 
//                   pageNumber={pageNumber} 
//                   scale={scale} 
//                   renderAnnotationLayer={false}
//                   renderTextLayer={false}
//                   width={600}
//                 />
//               </Document>
//             </div>
//             <div className="absolute inset-0 z-10">
//               <canvas ref={canvasRef} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import * as fabric from 'fabric';
// import { PDFDocument, PDFName, PDFString, PDFArray } from 'pdf-lib';
// import { Document, Page, pdfjs } from 'react-pdf';
// import {
//   Type,
//   Image as ImageIcon,
//   PenTool,
//   Eraser,
//   Highlighter,
//   MousePointer2,
//   Square,
//   Link as LinkIcon,
//   TextCursorInput,
//   Undo2,
//   Redo2,
//   Bold,
//   Italic,
//   Trash2,
//   ZoomIn,
//   ZoomOut,
//   Download,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   MoveUp,
//   Unlock,
//   MoveDown,
//   Copy,
//   Lock,
//   ClipboardCheck,
// } from 'lucide-react';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PDFEditorProps {
//   file: File;
// }

// type Tool = 'select' | 'text' | 'edit-text' | 'whiteout' | 'highlight' | 'draw' | 'rect' | 'link';

// interface TextRun {
//   str: string;
//   left: number;
//   top: number;
//   width: number;
//   height: number;
// }

// const SWATCHES = ['#111111', '#E8502A', '#2563EB', '#16A34A', '#EAB308', '#FFFFFF'];
// const MIN_SCALE = 0.5;
// const MAX_SCALE = 2.5;
// const BRUSH_SIZES = [
//   { label: 'Slim', value: 2 },
//   { label: 'Medium', value: 5 },
//   { label: 'Thick', value: 10 },
// ];

// export default function PDFEditor({ file }: PDFEditorProps) {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1.0);
//   const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
//   const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
//   const [activeTool, setActiveTool] = useState<Tool>('select');
//   const [activeColor, setActiveColor] = useState('#E8502A');
//   const [brushWidth, setBrushWidth] = useState(5);
//   const [isExporting, setIsExporting] = useState(false);
//   const [canUndo, setCanUndo] = useState(false);
//   const [canRedo, setCanRedo] = useState(false);
//   const [nativePageSize, setNativePageSize] = useState({ width: 612, height: 792 });

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricRef = useRef<fabric.Canvas | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const imageInputRef = useRef<HTMLInputElement>(null);

//   const activeToolRef = useRef<Tool>('select');
//   const activeColorRef = useRef(activeColor);
//   useEffect(() => {
//     activeToolRef.current = activeTool;
//   }, [activeTool]);
//   useEffect(() => {
//     activeColorRef.current = activeColor;
//   }, [activeColor]);

//   // Per-page persisted annotation state (fabric JSON strings, includes custom "data" prop)
//   const pageDataRef = useRef<Record<number, string>>({});
//   const currentPageRef = useRef(pageNumber);

//   // pdf.js page proxies + cached text content, used for the "Edit Text" tool
//   const pageProxyRef = useRef<Record<number, any>>({});
//   const textContentRef = useRef<Record<number, any>>({});

//   // Undo/redo history, scoped per page
//   const historyRef = useRef<Record<number, { stack: string[]; index: number }>>({});
//   const clipboardRef = useRef<fabric.Object | null>(null);
//   const isRestoringRef = useRef(false);

//   const JSON_PROPS = ['data'];

//   // ---------- Fabric canvas lifecycle (created once, fixed to native PDF point size) ----------


//   const copyObject = async () => {
//     const canvas = fabricRef.current;

//     if (!canvas) return;

//     const active = canvas.getActiveObject();

//     if (!active) return;

//     const cloned = await active.clone();

//     clipboardRef.current = cloned;
//   };

//   const pasteObject = async () => {
//     const canvas = fabricRef.current;

//     if (!canvas) return;

//     if (!clipboardRef.current) return;

//     const cloned = await clipboardRef.current.clone();

//     cloned.set({
//       left: (cloned.left ?? 0) + 20,
//       top: (cloned.top ?? 20) + 20,
//     });

//     canvas.add(cloned);

//     canvas.setActiveObject(cloned);

//     canvas.renderAll();
//   };

//   const duplicateObject = async () => {
//     await copyObject();

//     await pasteObject();
//   };

//   const bringForward = () => {
//     const canvas = fabricRef.current;

//     if (!canvas) return;

//     const obj = canvas.getActiveObject();

//     if (!obj) return;

//     canvas.bringObjectForward(obj);

//     canvas.renderAll();
//   };

//   const sendBackward = () => {
//     const canvas = fabricRef.current;

//     if (!canvas) return;

//     const obj = canvas.getActiveObject();

//     if (!obj) return;

//     canvas.sendObjectBackwards(obj);

//     canvas.renderAll();
//   };


//   const lockObject = () => {
//     const canvas = fabricRef.current;

//     if (!canvas) return;

//     const obj = canvas.getActiveObject();

//     if (!obj) return;

//     obj.set({
//       selectable: false,
//       evented: false,
//       lockMovementX: true,
//       lockMovementY: true,
//       lockRotation: true,
//       lockScalingX: true,
//       lockScalingY: true,
//     });

//     canvas.discardActiveObject();

//     canvas.renderAll();
//   };


//   const unlockAll = () => {
//     const canvas = fabricRef.current;

//     if (!canvas) return;

//     canvas.getObjects().forEach((obj) => {
//       obj.set({
//         selectable: true,
//         evented: true,
//         lockMovementX: false,
//         lockMovementY: false,
//         lockRotation: false,
//         lockScalingX: false,
//         lockScalingY: false,
//       });
//     });

//     canvas.renderAll();
//   };


//   useEffect(() => {
//     const handleKeyDown = async (e: KeyboardEvent) => {
//       const isInput =
//         e.target instanceof HTMLInputElement ||
//         e.target instanceof HTMLTextAreaElement;

//       if (isInput) return;

//       if (e.key === "Delete") {
//         e.preventDefault();
//         deleteSelected();
//       }

//       if (e.key === "Escape") {
//         fabricRef.current?.discardActiveObject();
//         fabricRef.current?.renderAll();
//       }

//       if (e.ctrlKey && e.key.toLowerCase() === "c") {
//         e.preventDefault();
//         await copyObject();
//       }

//       if (e.ctrlKey && e.key.toLowerCase() === "v") {
//         e.preventDefault();
//         await pasteObject();
//       }

//       if (e.ctrlKey && e.key.toLowerCase() === "d") {
//         e.preventDefault();
//         await duplicateObject();
//       }

//       if (e.ctrlKey && e.key.toLowerCase() === "z") {
//         e.preventDefault();
//         undo();
//       }

//       if (e.ctrlKey && e.key.toLowerCase() === "y") {
//         e.preventDefault();
//         redo();
//       }

//       if (e.key === "]") {
//         bringForward();
//       }

//       if (e.key === "[") {
//         sendBackward();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedObject]);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const fabricCanvas = new fabric.Canvas(canvasRef.current, {
//       isDrawingMode: false,
//       width: nativePageSize.width,
//       height: nativePageSize.height,
//       backgroundColor: undefined,
//     });
//     // Explicitly create the brush so drawing works regardless of lazy-init behavior.
//     fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
//     fabricCanvas.freeDrawingBrush.color = activeColorRef.current;
//     fabricCanvas.freeDrawingBrush.width = brushWidth;
//     fabricRef.current = fabricCanvas;

//     const updateToolbarPosition = (obj: fabric.Object) => {
//       const rect = obj.getBoundingRect();
//       setToolbarPosition({ top: Math.max(rect.top - 46, 0), left: rect.left + rect.width / 2 });
//     };

//     fabricCanvas.on('selection:created', (e) => {
//       if (e.selected?.[0]) {
//         updateToolbarPosition(e.selected[0]);
//         setSelectedObject(e.selected[0]);
//       }
//     });
//     fabricCanvas.on('selection:updated', (e) => {
//       if (e.selected?.[0]) {
//         updateToolbarPosition(e.selected[0]);
//         setSelectedObject(e.selected[0]);
//       }
//     });
//     fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
//     fabricCanvas.on('object:moving', (e) => e.target && updateToolbarPosition(e.target));
//     fabricCanvas.on('object:scaling', (e) => e.target && updateToolbarPosition(e.target));

//     const pushHistory = () => {
//       if (isRestoringRef.current) return;
//       const page = currentPageRef.current;
//       const json = JSON.stringify(fabricCanvas.toObject(JSON_PROPS));
//       const entry = historyRef.current[page] ?? { stack: [], index: -1 };
//       const trimmed = entry.stack.slice(0, entry.index + 1);
//       trimmed.push(json);
//       historyRef.current[page] = { stack: trimmed, index: trimmed.length - 1 };
//       setCanUndo(trimmed.length > 1);
//       setCanRedo(false);
//     };

//     fabricCanvas.on('object:added', pushHistory);
//     fabricCanvas.on('object:removed', pushHistory);
//     fabricCanvas.on('object:modified', pushHistory);
//     fabricCanvas.on('path:created', pushHistory);

//     // Click-to-place / click-to-edit interactions
//     fabricCanvas.on('mouse:down', (opt) => {
//       const tool = activeToolRef.current;
//       if (tool === 'select' || tool === 'draw') return;
//       // Don't hijack clicks that are meant to interact with an existing object.
//       if (opt.target) return;
//       const pointer = fabricCanvas.getScenePoint(opt.e);

//       if (tool === 'text') {
//         placeText(pointer.x, pointer.y);
//         setActiveTool('select');
//       } else if (tool === 'edit-text') {
//         editTextAtPoint(pointer.x, pointer.y);
//       } else if (tool === 'whiteout') {
//         placeWhiteout(pointer.x, pointer.y);
//         setActiveTool('select');
//       } else if (tool === 'highlight') {
//         placeHighlight(pointer.x, pointer.y);
//         setActiveTool('select');
//       } else if (tool === 'rect') {
//         placeRect(pointer.x, pointer.y);
//         setActiveTool('select');
//       } else if (tool === 'link') {
//         placeLink(pointer.x, pointer.y);
//         setActiveTool('select');
//       }
//     });

//     if (!historyRef.current[currentPageRef.current]) {
//       const json = JSON.stringify(fabricCanvas.toObject(JSON_PROPS));
//       historyRef.current[currentPageRef.current] = { stack: [json], index: 0 };
//     }

//     return () => {
//       fabricCanvas.dispose();
//       fabricRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [nativePageSize.width, nativePageSize.height]);

//   // ---------- Keep the free-draw brush's live color/width in sync ----------
//   useEffect(() => {
//     const c = fabricRef.current;
//     if (!c || !c.freeDrawingBrush) return;
//     c.freeDrawingBrush.color = activeColor;
//     c.freeDrawingBrush.width = brushWidth;
//   }, [activeColor, brushWidth]);

//   useEffect(() => {
//     const c = fabricRef.current;
//     if (!c) return;
//     c.isDrawingMode = activeTool === 'draw';
//   }, [activeTool]);

//   // ---------- Save/restore annotations when the page changes ----------
//   useEffect(() => {
//     const c = fabricRef.current;
//     if (!c) return;

//     const prevPage = currentPageRef.current;
//     if (prevPage !== pageNumber) {
//       pageDataRef.current[prevPage] = JSON.stringify(c.toObject(JSON_PROPS));
//     }
//     currentPageRef.current = pageNumber;

//     isRestoringRef.current = true;
//     const saved = pageDataRef.current[pageNumber];
//     const afterLoad = () => {
//       c.renderAll();
//       isRestoringRef.current = false;
//       if (!historyRef.current[pageNumber]) {
//         historyRef.current[pageNumber] = { stack: [JSON.stringify(c.toObject(JSON_PROPS))], index: 0 };
//       }
//       const h = historyRef.current[pageNumber];
//       setCanUndo(h.index > 0);
//       setCanRedo(h.index < h.stack.length - 1);
//     };

//     if (saved) {
//       c.loadFromJSON(saved, afterLoad);
//     } else {
//       c.clear();
//       afterLoad();
//     }
//     setSelectedObject(null);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pageNumber]);

//   // ---------- Page load callbacks ----------
//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//   }

//   function onPageLoadSuccess(page: any) {
//     pageProxyRef.current[pageNumber] = page;
//     if (!textContentRef.current[pageNumber]) {
//       page.getTextContent().then((tc: any) => {
//         textContentRef.current[pageNumber] = tc;
//       });
//     }
//     const w = page.originalWidth ?? page.width;
//     const h = page.originalHeight ?? page.height;
//     if (w && h && (Math.round(w) !== Math.round(nativePageSize.width) || Math.round(h) !== Math.round(nativePageSize.height))) {
//       setNativePageSize({ width: w, height: h });
//     }
//   }

//   // ---------- Text run lookup (for the Edit Text tool) ----------
//   function getTextRuns(pageNum: number): TextRun[] {
//     const page = pageProxyRef.current[pageNum];
//     const content = textContentRef.current[pageNum];
//     if (!page || !content) return [];
//     const viewport = page.getViewport({ scale: 1 });
//     return content.items
//       .filter((it: any) => it.str && it.str.trim().length > 0)
//       .map((it: any) => {
//         const tx = pdfjs.Util.transform(viewport.transform, it.transform);
//         const fontHeight = Math.hypot(tx[2], tx[3]) || 10;
//         const scaleFactor = it.height ? fontHeight / it.height : 1;
//         return {
//           str: it.str,
//           left: tx[4],
//           top: tx[5] - fontHeight,
//           width: it.width * scaleFactor,
//           height: fontHeight,
//         } as TextRun;
//       });
//   }

//   // ---------- Tool actions ----------
//   const placeText = (x: number, y: number) => {
//     const c = fabricRef.current;
//     if (!c) return;
//     const text = new fabric.IText('Type here', {
//       left: x,
//       top: y,
//       fontSize: 16,
//       fontFamily: 'Plus Jakarta Sans, sans-serif',
//       fill: activeColorRef.current,
//     });
//     c.add(text);
//     c.setActiveObject(text);
//     text.enterEditing();
//     text.selectAll();
//     c.renderAll();
//   };

//   const editTextAtPoint = (x: number, y: number) => {
//     const c = fabricRef.current;
//     if (!c) return;
//     const runs = getTextRuns(pageNumber);
//     const hit = runs.find((r) => x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height);

//     if (!hit) {
//       if (textContentRef.current[pageNumber] === undefined) {
//         window.alert("Still reading this page's text — try clicking again in a moment.");
//       } else {
//         window.alert('No editable text found there. (Scanned/image-only pages have no underlying text to edit — use Add Text instead.)');
//       }
//       return;
//     }

//     const pad = 1;
//     const whiteout = new fabric.Rect({
//       left: hit.left - pad,
//       top: hit.top - pad,
//       width: hit.width + pad * 2,
//       height: hit.height + pad * 2,
//       fill: '#ffffff',
//       selectable: true,
//     });
//     const editText = new fabric.IText(hit.str, {
//       left: hit.left,
//       top: hit.top,
//       fontSize: Math.max(6, hit.height * 0.82),
//       fontFamily: 'sans-serif',
//       fill: '#111111',
//     });
//     c.add(whiteout);
//     c.add(editText);
//     c.setActiveObject(editText);
//     editText.enterEditing();
//     editText.selectAll();
//     c.renderAll();
//     setActiveTool('select');
//   };

//   const placeWhiteout = (x: number, y: number) => {
//     const c = fabricRef.current;
//     if (!c) return;
//     const rect = new fabric.Rect({ left: x, top: y, fill: '#ffffff', width: 160, height: 30, stroke: '#e5e7eb', strokeWidth: 1 });
//     c.add(rect);
//     c.setActiveObject(rect);
//     c.renderAll();
//   };

//   const placeHighlight = (x: number, y: number) => {
//     const c = fabricRef.current;
//     if (!c) return;
//     const rect = new fabric.Rect({ left: x, top: y, fill: 'rgba(255, 235, 59, 0.4)', width: 160, height: 22 });
//     c.add(rect);
//     c.setActiveObject(rect);
//     c.renderAll();
//   };

//   const placeRect = (x: number, y: number) => {
//     const c = fabricRef.current;
//     if (!c) return;
//     const rect = new fabric.Rect({ left: x, top: y, fill: 'rgba(232, 80, 42, 0.15)', width: 120, height: 60, stroke: activeColorRef.current, strokeWidth: 2 });
//     c.add(rect);
//     c.setActiveObject(rect);
//     c.renderAll();
//   };

//   const placeLink = (x: number, y: number) => {
//     const c = fabricRef.current;
//     if (!c) return;
//     const url = window.prompt('Link URL (include https://)');
//     if (!url) return;
//     const rect = new fabric.Rect({
//       left: x,
//       top: y,
//       width: 140,
//       height: 24,
//       fill: 'rgba(37, 99, 235, 0.08)',
//       stroke: '#2563EB',
//       strokeDashArray: [4, 3],
//       strokeWidth: 1.5,
//     });
//     (rect as any).data = { isLink: true, url };
//     c.add(rect);
//     c.setActiveObject(rect);
//     c.renderAll();
//   };

//   const triggerImagePicker = () => imageInputRef.current?.click();

//   const onImageChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file0 = e.target.files?.[0];
//     const c = fabricRef.current;
//     if (!file0 || !c) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       const url = ev.target?.result as string;
//       fabric.FabricImage.fromURL(url).then((img) => {
//         img.scaleToWidth(160);
//         img.set({ left: 80, top: 80 });
//         c.add(img);
//         c.setActiveObject(img);
//         c.renderAll();
//       });
//     };
//     reader.readAsDataURL(file0);
//     e.target.value = '';
//   };

//   const selectTool = (tool: Tool) => setActiveTool(tool);

//   const updateTextStyle = (style: 'fontWeight' | 'fontStyle' | 'fontSize', value: any) => {
//     const c = fabricRef.current;
//     if (!c || !selectedObject || selectedObject.type !== 'i-text') return;
//     const textObj = selectedObject as fabric.IText;
//     if (style === 'fontWeight') textObj.set('fontWeight', textObj.fontWeight === 'bold' ? 'normal' : 'bold');
//     else if (style === 'fontStyle') textObj.set('fontStyle', textObj.fontStyle === 'italic' ? 'normal' : 'italic');
//     else textObj.set(style, value);
//     c.renderAll();
//     c.fire('object:modified');
//   };

//   const applyColorToSelection = (color: string) => {
//     setActiveColor(color);
//     const c = fabricRef.current;
//     if (!c) return;
//     if (selectedObject) {
//       if (selectedObject.type === 'i-text') selectedObject.set('fill', color);
//       else selectedObject.set('stroke', color);
//       c.renderAll();
//       c.fire('object:modified');
//     }
//   };

//   const deleteSelected = () => {
//     const c = fabricRef.current;
//     if (!c || !selectedObject) return;
//     c.remove(selectedObject);
//     c.discardActiveObject();
//     c.renderAll();
//     setSelectedObject(null);
//   };

//   // ---------- Undo / redo ----------
//   const restoreFromHistory = (page: number, index: number) => {
//     const c = fabricRef.current;
//     const entry = historyRef.current[page];
//     if (!c || !entry || index < 0 || index >= entry.stack.length) return;
//     isRestoringRef.current = true;
//     c.loadFromJSON(entry.stack[index], () => {
//       c.renderAll();
//       isRestoringRef.current = false;
//       historyRef.current[page] = { ...entry, index };
//       setCanUndo(index > 0);
//       setCanRedo(index < entry.stack.length - 1);
//     });
//   };

//   const undo = () => {
//     const entry = historyRef.current[pageNumber];
//     if (!entry || entry.index <= 0) return;
//     restoreFromHistory(pageNumber, entry.index - 1);
//   };
//   const redo = () => {
//     const entry = historyRef.current[pageNumber];
//     if (!entry || entry.index >= entry.stack.length - 1) return;
//     restoreFromHistory(pageNumber, entry.index + 1);
//   };

//   // ---------- Zoom (CSS-only; document coordinates never change) ----------
//   const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, +(s + 0.1).toFixed(2)));
//   const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, +(s - 0.1).toFixed(2)));

//   // ---------- Export ----------
//   const exportPDF = useCallback(async () => {
//     const c = fabricRef.current;
//     if (!c || !numPages) return;
//     setIsExporting(true);
//     try {
//       pageDataRef.current[pageNumber] = JSON.stringify(c.toObject(JSON_PROPS));

//       const srcBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(srcBytes);
//       const pages = pdfDoc.getPages();

//       for (let i = 0; i < pages.length; i++) {
//         const pageIndex = i + 1;
//         const json = pageDataRef.current[pageIndex];
//         if (!json) continue;

//         const pdfPage = pages[i];
//         const { width: pw, height: ph } = pdfPage.getSize();

//         const offscreenEl = document.createElement('canvas');
//         const offCanvas = new fabric.Canvas(offscreenEl, { width: pw, height: ph });
//         const parsed = JSON.parse(json);
//         const linkObjects: any[] = (parsed.objects || []).filter((o: any) => o?.data?.isLink);

//         await new Promise<void>((resolve) => {
//           offCanvas.loadFromJSON(json, () => {
//             const factor = pw / nativePageSize.width;
//             offCanvas.getObjects().forEach((o) => {
//               // Hide link boxes from the rasterized overlay — they become real annotations below.
//               if ((o as any).data?.isLink) {
//                 o.set({ opacity: 0 });
//                 return;
//               }
//               o.set({
//                 left: (o.left ?? 0) * factor,
//                 top: (o.top ?? 0) * factor,
//                 scaleX: (o.scaleX ?? 1) * factor,
//                 scaleY: (o.scaleY ?? 1) * factor,
//               });
//               o.setCoords();
//             });
//             offCanvas.renderAll();
//             resolve();
//           });
//         });

//         const dataUrl = offCanvas.toDataURL({ format: 'png', multiplier: 2 });
//         const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
//         const pngImage = await pdfDoc.embedPng(pngBytes);
//         pdfPage.drawImage(pngImage, { x: 0, y: 0, width: pw, height: ph });
//         offCanvas.dispose();

//         // Real PDF link annotations (not rasterized, so they stay clickable).
//         const factor = pw / nativePageSize.width;
//         for (const link of linkObjects) {
//           try {
//             const lw = (link.width ?? 0) * (link.scaleX ?? 1) * factor;
//             const lh = (link.height ?? 0) * (link.scaleY ?? 1) * factor;
//             const lx = (link.left ?? 0) * factor;
//             const ly = ph - (link.top ?? 0) * factor - lh;
//             addLinkAnnotation(pdfDoc, pdfPage, { x: lx, y: ly, width: lw, height: lh }, link.data.url);
//           } catch {
//             // Skip a malformed link rather than aborting the whole export.
//           }
//         }
//       }

//       const outBytes = await pdfDoc.save();
//       const arrayBuffer = new Uint8Array(outBytes).buffer as ArrayBuffer;
//       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = file.name.replace(/\.pdf$/i, '') + '-edited.pdf';
//       a.click();
//       URL.revokeObjectURL(url);
//     } finally {
//       setIsExporting(false);
//     }
//   }, [file, numPages, pageNumber, nativePageSize]);

//   function addLinkAnnotation(
//     pdfDoc: PDFDocument,
//     page: ReturnType<PDFDocument['getPages']>[number],
//     rect: { x: number; y: number; width: number; height: number },
//     url: string
//   ) {
//     const linkDict = pdfDoc.context.obj({
//       Type: 'Annot',
//       Subtype: 'Link',
//       Rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
//       Border: [0, 0, 0],
//       A: {
//         Type: 'Action',
//         S: 'URI',
//         URI: PDFString.of(url),
//       },
//     });
//     const linkRef = pdfDoc.context.register(linkDict);
//     const annotsKey = PDFName.of('Annots');
//     const existing = (page as any).node.get(annotsKey);
//     if (existing instanceof PDFArray) {
//       existing.push(linkRef);
//     } else {
//       (page as any).node.set(annotsKey, pdfDoc.context.obj([linkRef]));
//     }
//   }

//   const goToPage = (n: number) => {
//     if (!numPages) return;
//     setPageNumber(Math.min(Math.max(1, n), numPages));
//   };

//   const displayWidth = nativePageSize.width * scale;
//   const displayHeight = nativePageSize.height * scale;

//   return (
//     <div className="flex flex-col h-screen bg-surface">
//       <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageChosen} />

//       {/* Main Toolbar */}
//       <div className="h-14 bg-white border-b border-border-custom flex items-center justify-between px-4 gap-4 sticky top-0 z-50 shadow-sm">
//         <div className="flex items-center bg-blue-50/50 rounded-lg p-1 gap-1 border border-blue-100">
//           <ToolButton icon={<MousePointer2 className="w-3.5 h-3.5" />} label="Select" active={activeTool === 'select'} onClick={() => selectTool('select')} />
//           <ToolButton icon={<Type className="w-3.5 h-3.5" />} label="Add Text" active={activeTool === 'text'} onClick={() => selectTool('text')} />
//           <ToolButton icon={<TextCursorInput className="w-3.5 h-3.5" />} label="Edit Text" active={activeTool === 'edit-text'} onClick={() => selectTool('edit-text')} />
//           <ToolButton icon={<Highlighter className="w-3.5 h-3.5" />} label="Highlight" active={activeTool === 'highlight'} onClick={() => selectTool('highlight')} />
//           <ToolButton icon={<Eraser className="w-3.5 h-3.5" />} label="Whiteout" active={activeTool === 'whiteout'} onClick={() => selectTool('whiteout')} />
//           <ToolButton icon={<PenTool className="w-3.5 h-3.5" />} label="Draw" active={activeTool === 'draw'} onClick={() => selectTool('draw')} />
//           <ToolButton icon={<Square className="w-3.5 h-3.5" />} label="Shape" active={activeTool === 'rect'} onClick={() => selectTool('rect')} />
//           <ToolButton icon={<LinkIcon className="w-3.5 h-3.5" />} label="Link" active={activeTool === 'link'} onClick={() => selectTool('link')} />
//           <ToolButton icon={<ImageIcon className="w-3.5 h-3.5" />} label="Image" active={false} onClick={triggerImagePicker} />
//           <div className="w-px h-4 bg-blue-200 mx-1" />
//           <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-md text-blue-600 hover:bg-white disabled:opacity-30 transition-all">
//             <Undo2 className="w-3.5 h-3.5" />
//           </button>
//           <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-md text-blue-600 hover:bg-white disabled:opacity-30 transition-all">
//             <Redo2 className="w-3.5 h-3.5" />
//           </button>
//           <div className="w-px h-4 bg-blue-200 mx-1" />
//           {SWATCHES.map((color) => (
//             <button
//               key={color}
//               onClick={() => applyColorToSelection(color)}
//               className={`w-5 h-5 rounded-full border transition-transform ${activeColor === color ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : 'border-gray-200'}`}
//               style={{ backgroundColor: color }}
//               aria-label={`color ${color}`}
//             />
//           ))}
//           {activeTool === 'draw' && (
//             <>
//               <div className="w-px h-4 bg-blue-200 mx-1" />
//               {BRUSH_SIZES.map((b) => (
//                 <button
//                   key={b.value}
//                   onClick={() => setBrushWidth(b.value)}
//                   className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
//                     brushWidth === b.value ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-white'
//                   }`}
//                 >
//                   {b.label}
//                 </button>
//               ))}
//               <input
//                 type="range"
//                 min={1}
//                 max={20}
//                 value={brushWidth}
//                 onChange={(e) => setBrushWidth(Number(e.target.value))}
//                 className="w-16 accent-blue-600"
//               />
//             </>
//           )}
//         </div>

//         <button
//           onClick={exportPDF}
//           disabled={isExporting}
//           className="flex items-center gap-2 px-4 py-2 bg-[#E8502A] hover:bg-[#d1451f] text-white text-xs font-bold rounded-md shadow-sm transition-colors disabled:opacity-60"
//         >
//           {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
//           {isExporting ? 'Exporting…' : 'Export PDF'}
//         </button>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar / Thumbnails */}
//         <div className="w-56 bg-white border-r border-border-custom p-3 overflow-y-auto">
//           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Pages</h3>
//           <Document file={file} loading={null}>
//             <div className="space-y-3">
//               {Array.from(new Array(numPages ?? 0), (_, index) => (
//                 <div
//                   key={index}
//                   onClick={() => goToPage(index + 1)}
//                   className={`rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
//                     pageNumber === index + 1 ? 'border-primary shadow-lg' : 'border-transparent hover:border-gray-200'
//                   }`}
//                 >
//                   <Page pageNumber={index + 1} width={196} renderAnnotationLayer={false} renderTextLayer={false} loading={null} />
//                   <div className="text-center text-[10px] font-semibold text-gray-400 py-1 bg-surface">{index + 1}</div>
//                 </div>
//               ))}
//             </div>
//           </Document>
//         </div>

//         {/* Editor Area */}
//         <div className="grow overflow-auto p-12 flex flex-col items-center gap-4 bg-gray-100/50" ref={containerRef}>
//           <div className="relative shadow-2xl bg-white overflow-hidden" style={{ width: displayWidth, height: displayHeight }}>
//             {selectedObject && (
//               <div
//                 className="absolute z-50 bg-white border border-blue-200 shadow-xl rounded-lg p-1 flex items-center gap-1"
//                 style={{ top: toolbarPosition.top * scale, left: toolbarPosition.left * scale, transform: 'translateX(-50%)' }}
//               >
//                 {selectedObject.type === 'i-text' && (
//                   <>
//                     <button onClick={() => updateTextStyle('fontWeight', null)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                       <Bold className="w-3.5 h-3.5" />
//                     </button>
//                     <button onClick={() => updateTextStyle('fontStyle', null)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                       <Italic className="w-3.5 h-3.5" />
//                     </button>
//                     <div className="w-px h-4 bg-blue-100" />
//                     <button
//                       onClick={() => updateTextStyle('fontSize', ((selectedObject as fabric.IText).fontSize ?? 16) + 2)}
//                       className="p-1.5 hover:bg-blue-50 rounded text-blue-600 text-[10px] font-bold"
//                     >
//                       T↑
//                     </button>
//                     <button
//                       onClick={() => updateTextStyle('fontSize', Math.max(6, ((selectedObject as fabric.IText).fontSize ?? 16) - 2))}
//                       className="p-1.5 hover:bg-blue-50 rounded text-blue-600 text-[10px] font-bold"
//                     >
//                       T↓
//                     </button>
//                     <div className="w-px h-4 bg-blue-100" />
//                   </>
//                 )}
//                 <button onClick={deleteSelected} className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors">
//                   <Trash2 className="w-3.5 h-3.5" />
//                 </button>
//                 <button onClick={copyObject} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <Copy className="w-3.5 h-3.5" />
//                 </button>
//                 <button onClick={pasteObject} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <ClipboardCheck className="w-3.5 h-3.5" />
//                 </button>

//                 <button onClick={duplicateObject} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <Copy className="w-3.5 h-3.5" />
//                 </button>

//                 <button onClick={bringForward} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <MoveUp className="w-3.5 h-3.5" />
//                 </button>

//                 <button onClick={sendBackward} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <MoveDown className="w-3.5 h-3.5" />
//                 </button>

//                 <button onClick={lockObject} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <Lock className="w-3.5 h-3.5" />
//                 </button>

//                 <button onClick={unlockAll} className="p-1.5 hover:bg-blue-50 rounded text-blue-600 transition-colors">
//                   <Unlock className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             )}

//             {/* Fixed at native PDF point size; zoom is a pure CSS transform so annotation
//                 coordinates never need to be rescaled when the zoom level changes. */}
//             <div style={{ width: nativePageSize.width, height: nativePageSize.height, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
//               <div className="absolute inset-0 z-0">
//                 <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading={<PageSkeleton width={nativePageSize.width} height={nativePageSize.height} />}>
//                   <Page
//                     pageNumber={pageNumber}
//                     width={nativePageSize.width}
//                     onLoadSuccess={onPageLoadSuccess}
//                     renderAnnotationLayer={false}
//                     renderTextLayer={false}
//                     loading={<PageSkeleton width={nativePageSize.width} height={nativePageSize.height} />}
//                   />
//                 </Document>
//               </div>
//               <div className="absolute inset-0 z-10">
//                 <canvas ref={canvasRef} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom-right floating zoom + page controls */}
//         <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 bg-white border border-border-custom shadow-lg rounded-full px-2 py-1.5">
//           <button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30">
//             <ChevronLeft className="w-4 h-4" />
//           </button>
//           <span className="text-xs font-semibold text-gray-500 px-1 min-w-16 text-center">
//             Page {pageNumber} / {numPages ?? '…'}
//           </span>
//           <button onClick={() => goToPage(pageNumber + 1)} disabled={!numPages || pageNumber >= numPages} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30">
//             <ChevronRight className="w-4 h-4" />
//           </button>
//           <div className="w-px h-4 bg-gray-200 mx-1" />
//           <button onClick={zoomOut} disabled={scale <= MIN_SCALE} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30">
//             <ZoomOut className="w-4 h-4" />
//           </button>
//           <span className="text-xs font-semibold text-gray-500 w-10 text-center">{Math.round(scale * 100)}%</span>
//           <button onClick={zoomIn} disabled={scale >= MAX_SCALE} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30">
//             <ZoomIn className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ToolButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
//         active ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-white'
//       }`}
//     >
//       {icon} {label}
//     </button>
//   );
// }

// function PageSkeleton({ width, height }: { width: number; height: number }) {
//   return <div className="animate-pulse bg-gray-200" style={{ width, height }} />;
// }


"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as fabric from 'fabric';
import { PDFDocument, PDFName, PDFString, PDFArray, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Type,
  Image as ImageIcon,
  PenTool,
  Eraser,
  Highlighter,
  MousePointer2,
  Square,
  Circle,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Trash2,
  ZoomIn,
  ZoomOut,
  Download,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoveUp,
  Unlock,
  MoveDown,
  Copy,
  CopyPlus,
  Scissors,
  ClipboardCheck,
  Lock,
  FilePlus2,
  Plus,
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFEditorProps {
  file: File;
}

type Tool = 'select' | 'text' | 'whiteout' | 'highlight' | 'draw' | 'rect' | 'ellipse' | 'link';

type PdfFontKind = 'serif' | 'sans' | 'mono';

interface TextRun {
  str: string;
  left: number;
  top: number;
  width: number;
  height: number;
  baseline: number;
  fontKind: PdfFontKind;
  bold: boolean;
  fontName: string;
}

interface PdfLine {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  baseline: number;
  fontSize: number;
  fontKind: PdfFontKind;
  bold: boolean;
  fontName: string;
}

const SWATCHES = ['#171717', '#DC4C2F', '#2563EB', '#16A34A', '#D9A404', '#FFFFFF'];
const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;
const BRUSH_SIZES = [
  { label: 'Slim', value: 2 },
  { label: 'Medium', value: 5 },
  { label: 'Thick', value: 10 },
];
const JSON_PROPS = ['data'];
// pdf.js drops embedded font bytes after painting unless this is set. The editor
// needs those bytes so a rewritten line keeps the PDF's own face and point size.
const PDFJS_DOCUMENT_OPTIONS = { fontExtraProperties: true };
// When a click-to-edit text replacement is created, its whiteout backing rect is offset from
// the text by this many points on each side. Kept as a constant so the pieces can be re-synced
// whenever either one is dragged or scaled.
const EDIT_PAIR_PAD = 1.5;
// Fabric draws the alphabetic baseline this far below the top of a top-left-origin text box.
const FABRIC_BASELINE_RATIO = 1.13 * (1 - 0.222);

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  if (h.length < 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function textTopForBaseline(baseline: number, fontSize: number) {
  return baseline - fontSize * FABRIC_BASELINE_RATIO;
}

function fontKindFromPdf(fontName: string, fontFamily: string): PdfFontKind {
  const name = `${fontName} ${fontFamily}`.toLowerCase();
  if (name.includes('mono') || name.includes('courier') || name.includes('consol') || name.includes('typewriter')) return 'mono';
  if (
    name.includes('serif') ||
    name.includes('times') ||
    name.includes('georgia') ||
    name.includes('roman') ||
    name.includes('garamond') ||
    name.includes('cambria') ||
    name.includes('palatino') ||
    name.includes('liberation serif')
  ) {
    return 'serif';
  }
  if (name.includes('sans')) return 'sans';
  return 'sans';
}

function editorFontFamily(kind: PdfFontKind) {
  if (kind === 'serif') return 'Times New Roman, Times, serif';
  if (kind === 'mono') return 'Courier New, Courier, monospace';
  return 'Helvetica, Arial, sans-serif';
}

function fillToRgb(fill: unknown) {
  if (typeof fill !== 'string') return rgb(0.09, 0.09, 0.09);
  const hex = fill.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return rgb(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);
  }
  return rgb(0.09, 0.09, 0.09);
}

function syncPdfTextCover(canvas: fabric.Canvas, target: fabric.Object) {
  const info = (target as any).data;
  if (!info?.pairId || info.role !== 'pdf-text') return;
  const partner = canvas.getObjects().find((o) => o !== target && (o as any).data?.pairId === info.pairId);
  if (!partner) return;
  const extraLeft = info.extraLeft ?? EDIT_PAIR_PAD;
  const extraTop = info.extraTop ?? EDIT_PAIR_PAD;
  const extraRight = info.extraRight ?? EDIT_PAIR_PAD;
  const extraBottom = info.extraBottom ?? EDIT_PAIR_PAD;
  const textWidth = target.getScaledWidth?.() ?? (target.width ?? 0) * (target.scaleX ?? 1);
  const textHeight = target.getScaledHeight?.() ?? (target.height ?? 0) * (target.scaleY ?? 1);
  partner.set({
    originX: 'left',
    originY: 'top',
    left: (target.left ?? 0) - extraLeft,
    top: (target.top ?? 0) - extraTop,
    width: Math.max(info.minWidth ?? 0, textWidth + extraLeft + extraRight),
    height: Math.max(info.minHeight ?? 0, textHeight + extraTop + extraBottom),
    scaleX: 1,
    scaleY: 1,
  });
  partner.setCoords();
}

function caretIndexAt(text: fabric.IText, sceneX: number) {
  const bounds = (text as any).__charBounds?.[0] as { left: number; width: number }[] | undefined;
  const localX = sceneX - (text.left ?? 0);
  if (!bounds?.length) return (text.text ?? '').length;
  for (let i = 0; i < bounds.length; i++) {
    const b = bounds[i];
    if (localX < b.left + b.width / 2) return i;
  }
  return (text.text ?? '').length;
}

// ---------- small helpers for re-indexing per-page state when pages are inserted/removed ----------
function shiftRecordFrom<T>(record: Record<number, T>, fromPage: number, delta: number): Record<number, T> {
  const result: Record<number, T> = {};
  Object.keys(record).forEach((kStr) => {
    const k = Number(kStr);
    result[k >= fromPage ? k + delta : k] = record[k];
  });
  return result;
}
function removePageAndShift<T>(record: Record<number, T>, page: number): Record<number, T> {
  const result: Record<number, T> = {};
  Object.keys(record).forEach((kStr) => {
    const k = Number(kStr);
    if (k === page) return;
    result[k > page ? k - 1 : k] = record[k];
  });
  return result;
}

export default function PDFEditor({ file }: PDFEditorProps) {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [activeColor, setActiveColor] = useState('#DC4C2F');
  const [brushWidth, setBrushWidth] = useState(5);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [nativePageSize, setNativePageSize] = useState({ width: 612, height: 792 });
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const [canvasEpoch, setCanvasEpoch] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCanvasEl = useCallback((node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    if (node) setCanvasEpoch((n) => n + 1);
  }, []);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeToolRef = useRef<Tool>('select');
  const activeColorRef = useRef(activeColor);
  const toolActionsRef = useRef<{
    editTextAtPoint: (x: number, y: number) => boolean;
    placeText: (x: number, y: number) => void;
    placeWhiteout: (x: number, y: number) => void;
    placeWhiteoutRect: (left: number, top: number, width: number, height: number) => void;
    placeHighlight: (x: number, y: number) => void;
    placeHighlightRect: (left: number, top: number, width: number, height: number) => void;
    placeShape: (x: number, y: number, kind: 'rect' | 'ellipse') => void;
    placeShapeRect: (left: number, top: number, width: number, height: number, kind: 'rect' | 'ellipse') => void;
    placeLink: (x: number, y: number) => void;
  } | null>(null);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);
  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  // Per-page persisted annotation state (fabric JSON strings, includes custom "data" prop)
  const pageDataRef = useRef<Record<number, string>>({});
  const currentPageRef = useRef(pageNumber);

  // pdf.js page proxies + cached text content, used to hit-test clicks against real PDF text
  const pageProxyRef = useRef<Record<number, any>>({});
  const textContentRef = useRef<Record<number, any>>({});
  // Original embedded font bytes and the CSS family name they were registered under.
  const pdfFontBytesRef = useRef<Record<string, Uint8Array>>({});
  const pdfFontCssRef = useRef<Record<string, string>>({});
  const pdfFontWeightRef = useRef<Record<string, string>>({});
  const pdfFontFailedRef = useRef<Set<string>>(new Set());

  // Undo/redo history, scoped per page
  const historyRef = useRef<Record<number, { stack: string[]; index: number }>>({});
  const clipboardRef = useRef<fabric.Object | null>(null);
  const isRestoringRef = useRef(false);
  const isPreviewRef = useRef(false);

  // ---------- Load the source file into working bytes once ----------
  useEffect(() => {
    let cancelled = false;
    setPdfBytes(null);
    file.arrayBuffer().then((buf) => {
      if (!cancelled) setPdfBytes(new Uint8Array(buf));
    });
    return () => {
      cancelled = true;
    };
  }, [file]);

  // react-pdf needs its own copy of the underlying buffer per <Document>, since pdf.js can
  // transfer/detach a raw Uint8Array it's given. Two <Document> instances (viewer + thumbnails)
  // each get a fresh clone whenever the working bytes change.
  const viewerFileSource = useMemo(() => (pdfBytes ? { data: pdfBytes.slice() } : null), [pdfBytes]);
  const thumbFileSource = useMemo(() => (pdfBytes ? { data: pdfBytes.slice() } : null), [pdfBytes]);

  // ---------- Clipboard / duplicate ----------
  const copyObject = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const cloned = await active.clone();
    clipboardRef.current = cloned;
  };

  const pasteObject = async () => {
    const canvas = fabricRef.current;
    if (!canvas || !clipboardRef.current) return;
    const cloned = await clipboardRef.current.clone();
    cloned.set({
      left: (cloned.left ?? 0) + 20,
      top: (cloned.top ?? 20) + 20,
    });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
  };

  const duplicateObject = async () => {
    await copyObject();
    await pasteObject();
  };

  const cutObject = async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    if (active.type === 'i-text' || active.type === 'text') {
      const value = (active as fabric.IText).text ?? '';
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Clipboard permission denied — the object is still cut from the page.
      }
    }
    await copyObject();
    canvas.remove(active);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const bringForward = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.bringObjectForward(obj);
    canvas.renderAll();
  };

  const sendBackward = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
  };

  const lockObject = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    obj.set({
      selectable: false,
      evented: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const unlockAll = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      obj.set({
        selectable: true,
        evented: true,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
      });
    });
    canvas.renderAll();
  };

  const deleteSelected = () => {
    const c = fabricRef.current;
    if (!c || !selectedObject) return;
    c.remove(selectedObject);
    c.discardActiveObject();
    c.renderAll();
    setSelectedObject(null);
  };

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === 'Escape') {
        fabricRef.current?.discardActiveObject();
        fabricRef.current?.renderAll();
      }
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 'x') {
          e.preventDefault();
          await cutObject();
        } else if (k === 'c') {
          e.preventDefault();
          await copyObject();
        } else if (k === 'v') {
          e.preventDefault();
          await pasteObject();
        } else if (k === 'd') {
          e.preventDefault();
          await duplicateObject();
        } else if (k === 'z') {
          e.preventDefault();
          undo();
        } else if (k === 'y') {
          e.preventDefault();
          redo();
        }
      }
      if (e.key === ']') bringForward();
      if (e.key === '[') sendBackward();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject]);

  // ---------- Fabric canvas lifecycle (fixed to native PDF point size) ----------
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      width: nativePageSize.width,
      height: nativePageSize.height,
      backgroundColor: undefined,
    });
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = activeColorRef.current;
    fabricCanvas.freeDrawingBrush.width = brushWidth;
    fabricRef.current = fabricCanvas;

    const updateToolbarPosition = (obj: fabric.Object) => {
      const rect = obj.getBoundingRect();
      setToolbarPosition({ top: Math.max(rect.top - 46, 0), left: rect.left + rect.width / 2 });
    };

    fabricCanvas.on('selection:created', (e) => {
      if (e.selected?.[0]) {
        updateToolbarPosition(e.selected[0]);
        setSelectedObject(e.selected[0]);
      }
    });
    fabricCanvas.on('selection:updated', (e) => {
      if (e.selected?.[0]) {
        updateToolbarPosition(e.selected[0]);
        setSelectedObject(e.selected[0]);
      }
    });
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));

    // A click-to-edit text replacement is really two objects (a whiteout rect + the editable
    // text on top). Whichever one the user drags or scales, keep its partner locked to the
    // same relative offset so they visually behave as a single unit.
    const syncPairedPartner = (target: fabric.Object) => {
      const info = (target as any).data;
      if (!info?.pairId || !info?.role) return;
      const partner = fabricCanvas.getObjects().find((o) => o !== target && (o as any).data?.pairId === info.pairId);
      if (!partner) return;
      if (info.role === 'pdf-text') {
        syncPdfTextCover(fabricCanvas, target);
        return;
      } else if (info.role === 'text') {
        partner.set({
          left: (target.left ?? 0) - EDIT_PAIR_PAD,
          top: (target.top ?? 0) - EDIT_PAIR_PAD,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
        });
      } else if (info.role !== 'pdf-whiteout') {
        partner.set({
          left: (target.left ?? 0) + EDIT_PAIR_PAD,
          top: (target.top ?? 0) + EDIT_PAIR_PAD,
        });
      }
      partner.setCoords();
    };

    fabricCanvas.on('object:moving', (e) => {
      if (!e.target) return;
      updateToolbarPosition(e.target);
      syncPairedPartner(e.target);
      fabricCanvas.requestRenderAll();
    });
    fabricCanvas.on('object:scaling', (e) => {
      if (!e.target) return;
      updateToolbarPosition(e.target);
      syncPairedPartner(e.target);
      fabricCanvas.requestRenderAll();
    });

    const pushHistory = () => {
      if (isRestoringRef.current || isPreviewRef.current) return;
      const page = currentPageRef.current;
      const json = JSON.stringify(fabricCanvas.toObject(JSON_PROPS));
      const entry = historyRef.current[page] ?? { stack: [], index: -1 };
      const trimmed = entry.stack.slice(0, entry.index + 1);
      trimmed.push(json);
      historyRef.current[page] = { stack: trimmed, index: trimmed.length - 1 };
      setCanUndo(trimmed.length > 1);
      setCanRedo(false);
    };
    fabricCanvas.on('object:added', pushHistory);
    fabricCanvas.on('object:removed', pushHistory);
    fabricCanvas.on('object:modified', pushHistory);
    fabricCanvas.on('path:created', pushHistory);

    // Click-to-place / drag-to-size / click-directly-on-text interactions.
    // Tool bodies live in toolActionsRef so this listener always calls the latest page's logic.
    let dragStart: { x: number; y: number } | null = null;
    let dragShape: fabric.Object | null = null;

    const boxFromDrag = (x1: number, y1: number, x2: number, y2: number) => {
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      return { left, top, width: Math.max(4, Math.abs(x2 - x1)), height: Math.max(4, Math.abs(y2 - y1)) };
    };

    fabricCanvas.on('mouse:down', (opt) => {
      const tool = activeToolRef.current;
      const actions = toolActionsRef.current;
      if (!actions || tool === 'draw') return;
      const pointer = fabricCanvas.getScenePoint(opt.e);

      if (tool === 'select') {
        if (opt.target) return;
        actions.editTextAtPoint(pointer.x, pointer.y);
        return;
      }

      if (tool === 'text') {
        actions.placeText(pointer.x, pointer.y);
        setActiveTool('select');
        return;
      }
      if (tool === 'link') {
        actions.placeLink(pointer.x, pointer.y);
        setActiveTool('select');
        return;
      }

      dragStart = { x: pointer.x, y: pointer.y };
      isPreviewRef.current = true;
      if (tool === 'ellipse') {
        dragShape = new fabric.Ellipse({
          left: pointer.x,
          top: pointer.y,
          originX: 'left',
          originY: 'top',
          rx: 2,
          ry: 2,
          fill: withAlpha(activeColorRef.current, 0.12),
          stroke: activeColorRef.current,
          strokeWidth: 2,
        });
      } else {
        const fill =
          tool === 'whiteout' ? '#ffffff' : tool === 'highlight' ? withAlpha(activeColorRef.current, 0.4) : withAlpha(activeColorRef.current, 0.12);
        const stroke = tool === 'whiteout' ? '#e5e7eb' : tool === 'highlight' ? undefined : activeColorRef.current;
        dragShape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          originX: 'left',
          originY: 'top',
          width: 2,
          height: 2,
          fill,
          stroke,
          strokeWidth: stroke ? (tool === 'whiteout' ? 1 : 2) : 0,
        });
      }
      fabricCanvas.add(dragShape);
    });

    fabricCanvas.on('mouse:move', (opt) => {
      if (!dragStart || !dragShape) return;
      const pointer = fabricCanvas.getScenePoint(opt.e);
      const box = boxFromDrag(dragStart.x, dragStart.y, pointer.x, pointer.y);
      if (dragShape.type === 'ellipse') {
        dragShape.set({ left: box.left, top: box.top, rx: box.width / 2, ry: box.height / 2 });
      } else {
        dragShape.set({ left: box.left, top: box.top, width: box.width, height: box.height });
      }
      dragShape.setCoords();
      fabricCanvas.requestRenderAll();
    });

    fabricCanvas.on('mouse:up', () => {
      if (!dragStart || !dragShape) return;
      const tool = activeToolRef.current;
      const actions = toolActionsRef.current;
      const start = dragStart;
      const shape = dragShape;
      dragStart = null;
      dragShape = null;
      const moved = (shape.width ?? 0) > 6 || (shape.height ?? 0) > 6 || ((shape as fabric.Ellipse).rx ?? 0) > 3;
      if (!moved || !actions) {
        fabricCanvas.remove(shape);
        isPreviewRef.current = false;
        if (actions && tool === 'whiteout') actions.placeWhiteout(start.x, start.y);
        else if (actions && tool === 'highlight') actions.placeHighlight(start.x, start.y);
        else if (actions && tool === 'rect') actions.placeShape(start.x, start.y, 'rect');
        else if (actions && tool === 'ellipse') actions.placeShape(start.x, start.y, 'ellipse');
      } else if (tool === 'ellipse') {
        isPreviewRef.current = false;
        const ellipse = shape as fabric.Ellipse;
        (ellipse as any).data = { role: 'shape' };
        fabricCanvas.setActiveObject(ellipse);
        fabricCanvas.fire('object:modified', { target: ellipse });
      } else {
        isPreviewRef.current = false;
        const role = tool === 'highlight' ? 'highlight' : tool === 'whiteout' ? 'whiteout' : 'shape';
        (shape as any).data = { role };
        fabricCanvas.setActiveObject(shape);
        fabricCanvas.fire('object:modified', { target: shape });
      }
      fabricCanvas.requestRenderAll();
      setActiveTool('select');
    });

    if (!historyRef.current[currentPageRef.current]) {
      const json = JSON.stringify(fabricCanvas.toObject(JSON_PROPS));
      historyRef.current[currentPageRef.current] = { stack: [json], index: 0 };
    }

    const toolNow = activeToolRef.current;
    fabricCanvas.isDrawingMode = toolNow === 'draw';
    fabricCanvas.selection = toolNow === 'select';
    fabricCanvas.skipTargetFind = toolNow !== 'select' && toolNow !== 'draw';

    return () => {
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEpoch, nativePageSize.width, nativePageSize.height]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c || !c.freeDrawingBrush) return;
    c.freeDrawingBrush.color = activeColor;
    c.freeDrawingBrush.width = brushWidth;
  }, [activeColor, brushWidth]);

  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    c.isDrawingMode = activeTool === 'draw';
    c.selection = activeTool === 'select';
    c.skipTargetFind = activeTool !== 'select' && activeTool !== 'draw';
    const cursor = activeTool === 'select' || activeTool === 'text' ? 'text' : 'crosshair';
    c.defaultCursor = cursor;
    c.hoverCursor = activeTool === 'select' ? 'move' : cursor;
    if (activeTool !== 'select') {
      c.discardActiveObject();
      c.requestRenderAll();
    }
  }, [activeTool]);

  // ---------- Save/restore annotations when the page changes ----------
  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;

    const prevPage = currentPageRef.current;
    if (prevPage !== pageNumber) {
      pageDataRef.current[prevPage] = JSON.stringify(c.toObject(JSON_PROPS));
    }
    currentPageRef.current = pageNumber;

    isRestoringRef.current = true;
    const saved = pageDataRef.current[pageNumber];
    const afterLoad = () => {
      c.renderAll();
      isRestoringRef.current = false;
      if (!historyRef.current[pageNumber]) {
        historyRef.current[pageNumber] = { stack: [JSON.stringify(c.toObject(JSON_PROPS))], index: 0 };
      }
      const h = historyRef.current[pageNumber];
      setCanUndo(h.index > 0);
      setCanRedo(h.index < h.stack.length - 1);
    };

    if (saved) {
      c.loadFromJSON(saved).then(afterLoad).catch(afterLoad);
    } else {
      c.clear();
      afterLoad();
    }
    setSelectedObject(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const persistCurrentPage = () => {
    const c = fabricRef.current;
    if (!c) return;
    pageDataRef.current[currentPageRef.current] = JSON.stringify(c.toObject(JSON_PROPS));
  };

  // ---------- Page load callbacks ----------
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onPageLoadSuccess(page: any) {
    const pn = page.pageNumber || pageNumber;
    pageProxyRef.current[pn] = page;
    if (!textContentRef.current[pn]) {
      page.getTextContent().then((tc: any) => {
        textContentRef.current[pn] = tc;
      });
    }
    // Read the true, unscaled PDF page size straight from pdf.js. Relying on react-pdf's
    // derived width/originalWidth here was the source of the "page gets cut off" bug: those
    // values can echo back whatever width we requested to render at, rather than the page's
    // real point size, so a page whose aspect ratio differs from what we assumed never
    // resized its container and got clipped at the bottom.
    const viewport = page.getViewport({ scale: 1 });
    const w = viewport.width;
    const h = viewport.height;
    if (w && h && (Math.round(w) !== Math.round(nativePageSize.width) || Math.round(h) !== Math.round(nativePageSize.height))) {
      setNativePageSize({ width: w, height: h });
    }
  }

  // ---------- Text run lookup (drives click-to-edit on real PDF text) ----------
  function getTextRuns(pageNum: number): TextRun[] {
    const page = pageProxyRef.current[pageNum];
    const content = textContentRef.current[pageNum];
    if (!page || !content) return [];
    const viewport = page.getViewport({ scale: 1 });
    return content.items
      .filter((it: any) => it.str && it.str.trim().length > 0)
      .map((it: any) => {
        const tx = pdfjs.Util.transform(viewport.transform, it.transform);
        const fontHeight = Math.hypot(tx[2], tx[3]) || Math.abs(it.height) || 10;
        const scaleFactor = it.height ? fontHeight / it.height : 1;
        const baseline = tx[5];
        const style = content.styles?.[it.fontName] || {};
        const fontBlob = `${it.fontName || ''} ${style.fontFamily || ''}`;
        return {
          str: it.str,
          left: tx[4],
          top: baseline - fontHeight,
          width: Math.max(it.width * scaleFactor, 0),
          height: fontHeight,
          baseline,
          fontKind: fontKindFromPdf(it.fontName || '', `${style.fontFamily || ''} ${style.fontWeight || ''}`),
          bold: /bold/i.test(fontBlob) || /bold|[7-9]00/i.test(String(style.fontWeight || '')),
          fontName: it.fontName || '',
        } as TextRun;
      });
  }

  function getPdfLines(pageNum: number): PdfLine[] {
    const runs = [...getTextRuns(pageNum)].sort((a, b) => a.baseline - b.baseline || a.left - b.left);
    const groups: TextRun[][] = [];
    for (const run of runs) {
      const group = groups.find((g) => Math.abs(g[0].baseline - run.baseline) <= Math.max(2, Math.min(g[0].height, run.height) * 0.45));
      if (group) group.push(run);
      else groups.push([run]);
    }
    return groups.map((group) => {
      group.sort((a, b) => a.left - b.left);
      let text = '';
      let cursor = group[0].left;
      for (const run of group) {
        const gap = run.left - cursor;
        if (text && gap > Math.max(1.5, run.height * 0.15) && !text.endsWith(' ') && !run.str.startsWith(' ')) {
          text += ' ';
        }
        text += run.str;
        cursor = Math.max(cursor, run.left + run.width);
      }
      const left = Math.min(...group.map((r) => r.left));
      const right = Math.max(...group.map((r) => r.left + r.width));
      const top = Math.min(...group.map((r) => r.top));
      const bottom = Math.max(...group.map((r) => r.top + r.height));
      const baseline = group.reduce((sum, r) => sum + r.baseline, 0) / group.length;
      const widest = group.reduce((best, run) => (run.width > best.width ? run : best), group[0]);
      const bold = group.filter((r) => r.bold).length * 2 >= group.length;
      return {
        text,
        left,
        top,
        width: Math.max(right - left, 4),
        height: Math.max(bottom - top, 4),
        baseline,
        fontSize: widest.height,
        fontKind: widest.fontKind,
        bold: widest.bold || bold,
        fontName: widest.fontName,
      };
    });
  }

  function lineAtPoint(pageNum: number, x: number, y: number): PdfLine | null {
    const lines = getPdfLines(pageNum);
    let best: PdfLine | null = null;
    let bestDist = Infinity;
    for (const line of lines) {
      if (x < line.left - 8 || x > line.left + line.width + 8) continue;
      const dist = Math.abs(y - (line.top + line.height / 2));
      const reach = Math.max(line.height * 0.65, 8);
      if (dist <= reach && dist < bestDist) {
        best = line;
        bestDist = dist;
      }
    }
    return best;
  }

  function focusLineEditor(text: fabric.IText, x: number) {
    const c = fabricRef.current;
    if (!c) return;
    text.initDimensions();
    const index = caretIndexAt(text, x);
    c.setActiveObject(text);
    text.enterEditing();
    text.setSelectionStart(index);
    text.setSelectionEnd(index);
    c.requestRenderAll();
  }

  // ---------- Tool actions ----------
  const placeText = (x: number, y: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const text = new fabric.IText('Type here', {
      left: x,
      top: y,
      originX: 'left',
      originY: 'top',
      fontSize: 16,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      fill: activeColorRef.current,
    });
    c.add(text);
    c.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    c.renderAll();
  };

  // Load the page's embedded font so the editor and the saved file use that face, not a substitute.
  async function ensurePdfFont(pageNum: number, fontName: string): Promise<string | null> {
    if (!fontName) return null;
    const key = `${pageNum}:${fontName}`;
    if (pdfFontCssRef.current[key]) return pdfFontCssRef.current[key];
    if (pdfFontFailedRef.current.has(key)) return null;
    const page = pageProxyRef.current[pageNum];
    if (!page?.commonObjs?.get) {
      pdfFontFailedRef.current.add(key);
      return null;
    }
    let fontObj: any = null;
    try {
      if (page.commonObjs.has?.(fontName)) {
        fontObj = page.commonObjs.get(fontName);
      } else {
        fontObj = await Promise.race([
          new Promise((resolve) => page.commonObjs.get(fontName, resolve)),
          new Promise((resolve) => window.setTimeout(() => resolve(null), 1200)),
        ]);
      }
    } catch {
      fontObj = null;
    }
    const cssInfo = fontObj?.cssFontInfo;
    const cssName = String(cssInfo?.fontFamily || fontObj?.loadedName || fontObj?.name || '').replace(/["\\]/g, '');
    const raw = fontObj?.data;
    const bytes = raw instanceof Uint8Array && raw.byteLength > 0 ? new Uint8Array(raw) : null;
    if (!cssName && !bytes) {
      pdfFontFailedRef.current.add(key);
      return null;
    }
    if (bytes) pdfFontBytesRef.current[key] = bytes;
    if (cssInfo?.fontWeight) pdfFontWeightRef.current[key] = String(cssInfo.fontWeight);
    if (cssName && bytes && !document.fonts.check(`16px "${cssName}"`)) {
      try {
        const face = new FontFace(cssName, bytes, cssInfo?.fontWeight ? { weight: String(cssInfo.fontWeight) } : undefined);
        await face.load();
        document.fonts.add(face);
      } catch {
        // pdf.js may already have painted with this face. Export still uses the bytes.
      }
    }
    if (!cssName) {
      pdfFontFailedRef.current.add(key);
      return null;
    }
    pdfFontCssRef.current[key] = cssName;
    return cssName;
  }

  // Clicking a PDF line covers that whole line and opens it for editing, with the caret
  // where the user clicked. Typing stays on that same line instead of inserting a new one.
  const editTextAtPoint = (x: number, y: number): boolean => {
    const c = fabricRef.current;
    if (!c) return false;
    const pageNum = currentPageRef.current;
    if (!textContentRef.current[pageNum] && pageProxyRef.current[pageNum]) {
      pageProxyRef.current[pageNum].getTextContent().then((tc: any) => {
        textContentRef.current[pageNum] = tc;
        editTextAtPoint(x, y);
      });
      return false;
    }
    const line = lineAtPoint(pageNum, x, y);
    if (!line) return false;

    const fontKey = line.fontName ? `${pageNum}:${line.fontName}` : '';
    if (fontKey && !pdfFontCssRef.current[fontKey] && !pdfFontFailedRef.current.has(fontKey)) {
      ensurePdfFont(pageNum, line.fontName).finally(() => editTextAtPoint(x, y));
      return false;
    }

    const existing = c.getObjects().find((o) => {
      const data = (o as any).data;
      return o.type === 'i-text' && data?.role === 'pdf-text' && Math.abs(data.baseline - line.baseline) < 3;
    }) as fabric.IText | undefined;
    if (existing) {
      focusLineEditor(existing, x);
      return true;
    }

    const fontSize = Math.max(6, line.fontSize);
    const ascent = fontSize * 0.92;
    const descent = fontSize * 0.28;
    const textTop = textTopForBaseline(line.baseline, fontSize);
    const pairId = `line-${pageNum}-${Math.round(line.baseline)}-${Math.round(line.left)}`;
    const coverLeft = line.left - 0.4;
    const coverTop = line.baseline - ascent;
    const coverWidth = line.width + 0.8;
    const coverHeight = ascent + descent;
    const matchedFamily = fontKey ? pdfFontCssRef.current[fontKey] : '';
    const cssFamily = matchedFamily || editorFontFamily(line.fontKind);
    const fontWeight = matchedFamily ? pdfFontWeightRef.current[fontKey] || 'normal' : line.bold ? 'bold' : 'normal';

    const whiteout = new fabric.Rect({
      left: coverLeft,
      top: coverTop,
      originX: 'left',
      originY: 'top',
      width: coverWidth,
      height: coverHeight,
      fill: '#ffffff',
      stroke: undefined,
      strokeWidth: 0,
      selectable: false,
      evented: false,
      objectCaching: false,
    });
    const editText = new fabric.IText(line.text, {
      left: line.left,
      top: textTop,
      originX: 'left',
      originY: 'top',
      fontSize,
      fontFamily: cssFamily,
      fontWeight,
      fill: '#000000',
      backgroundColor: '',
      textBackgroundColor: '',
      strokeWidth: 0,
      objectCaching: false,
      padding: 0,
    });
    editText.initDimensions();

    const textWidth = editText.width ?? line.width;
    const textHeight = editText.height ?? line.height;
    (whiteout as any).data = { pairId, role: 'pdf-whiteout' };
    (editText as any).data = {
      pairId,
      role: 'pdf-text',
      baseline: line.baseline,
      fontKind: line.fontKind,
      bold: line.bold,
      fontKey,
      pdfFontSize: fontSize,
      originalText: line.text,
      originalWidth: line.width,
      topAtCreate: textTop,
      extraLeft: (editText.left ?? 0) - (whiteout.left ?? 0),
      extraTop: (editText.top ?? 0) - (whiteout.top ?? 0),
      extraRight: (whiteout.left ?? 0) + (whiteout.width ?? 0) - ((editText.left ?? 0) + textWidth),
      extraBottom: (whiteout.top ?? 0) + (whiteout.height ?? 0) - ((editText.top ?? 0) + textHeight),
      minWidth: whiteout.width ?? line.width,
      minHeight: whiteout.height ?? line.height,
    };

    editText.on('changed', () => {
      const value = editText.text ?? '';
      if (value.includes('\n')) {
        const caret = editText.selectionStart ?? value.length;
        const stripped = value.replace(/\n/g, '');
        editText.set('text', stripped);
        const next = Math.min(stripped.length, Math.max(0, caret - 1));
        editText.setSelectionStart(next);
        editText.setSelectionEnd(next);
        editText.initDimensions();
      }
      if ((editText.text || '') !== line.text) {
        editText.set({ scaleX: 1 });
        editText.initDimensions();
      }
      if (c) syncPdfTextCover(c, editText);
      c?.requestRenderAll();
    });

    c.add(whiteout);
    c.add(editText);
    focusLineEditor(editText, x);
    return true;
  };

  const placeWhiteoutRect = (left: number, top: number, width: number, height: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const rect = new fabric.Rect({
      left,
      top,
      originX: 'left',
      originY: 'top',
      fill: '#ffffff',
      width,
      height,
      stroke: '#e5e7eb',
      strokeWidth: 1,
    });
    (rect as any).data = { role: 'whiteout' };
    c.add(rect);
    c.setActiveObject(rect);
    c.renderAll();
  };

  const placeWhiteout = (x: number, y: number) => {
    const line = lineAtPoint(currentPageRef.current, x, y);
    if (line) {
      placeWhiteoutRect(line.left - 1, line.top - 1, line.width + 2, line.height + Math.max(3, line.fontSize * 0.2));
      return;
    }
    placeWhiteoutRect(x, y, 160, 28);
  };

  const placeHighlightRect = (left: number, top: number, width: number, height: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const rect = new fabric.Rect({
      left,
      top,
      originX: 'left',
      originY: 'top',
      fill: withAlpha(activeColorRef.current, 0.4),
      width,
      height,
    });
    (rect as any).data = { role: 'highlight' };
    c.add(rect);
    c.setActiveObject(rect);
    c.renderAll();
  };

  const placeHighlight = (x: number, y: number) => {
    const line = lineAtPoint(currentPageRef.current, x, y);
    if (line) {
      placeHighlightRect(line.left - 1, line.top - 1, line.width + 2, line.height + 2);
      return;
    }
    placeHighlightRect(x, y, 160, 22);
  };

  const placeShapeRect = (left: number, top: number, width: number, height: number, kind: 'rect' | 'ellipse') => {
    const c = fabricRef.current;
    if (!c) return;
    const shared = {
      left,
      top,
      originX: 'left' as const,
      originY: 'top' as const,
      fill: withAlpha(activeColorRef.current, 0.12),
      stroke: activeColorRef.current,
      strokeWidth: 2,
    };
    const shape =
      kind === 'rect'
        ? new fabric.Rect({ ...shared, width, height })
        : new fabric.Ellipse({ ...shared, rx: width / 2, ry: height / 2 });
    (shape as any).data = { role: 'shape' };
    c.add(shape);
    c.setActiveObject(shape);
    c.renderAll();
  };

  const placeShape = (x: number, y: number, kind: 'rect' | 'ellipse') => {
    if (kind === 'rect') placeShapeRect(x, y, 120, 60, 'rect');
    else placeShapeRect(x, y, 120, 68, 'ellipse');
  };

  const placeLink = (x: number, y: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const url = window.prompt('Link URL (include https://)');
    if (!url) return;
    const rect = new fabric.Rect({
      left: x,
      top: y,
      originX: 'left',
      originY: 'top',
      width: 140,
      height: 24,
      fill: 'rgba(37, 99, 235, 0.08)',
      stroke: '#2563EB',
      strokeDashArray: [4, 3],
      strokeWidth: 1.5,
    });
    (rect as any).data = { isLink: true, url, role: 'link' };
    c.add(rect);
    c.setActiveObject(rect);
    c.renderAll();
  };

  toolActionsRef.current = {
    editTextAtPoint,
    placeText,
    placeWhiteout,
    placeWhiteoutRect,
    placeHighlight,
    placeHighlightRect,
    placeShape,
    placeShapeRect,
    placeLink,
  };

  const triggerImagePicker = () => imageInputRef.current?.click();

  const onImageChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file0 = e.target.files?.[0];
    const c = fabricRef.current;
    if (!file0 || !c) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      fabric.FabricImage.fromURL(url).then((img) => {
        img.scaleToWidth(160);
        img.set({ left: 80, top: 80, originX: 'left', originY: 'top' });
        c.add(img);
        c.setActiveObject(img);
        c.renderAll();
      });
    };
    reader.readAsDataURL(file0);
    e.target.value = '';
  };

  const selectTool = (tool: Tool) => setActiveTool(tool);

  const updateTextStyle = (style: 'fontWeight' | 'fontStyle' | 'fontSize' | 'underline', value: any) => {
    const c = fabricRef.current;
    if (!c || !selectedObject || selectedObject.type !== 'i-text') return;
    const textObj = selectedObject as fabric.IText;
    if (style === 'fontWeight') textObj.set('fontWeight', textObj.fontWeight === 'bold' ? 'normal' : 'bold');
    else if (style === 'fontStyle') textObj.set('fontStyle', textObj.fontStyle === 'italic' ? 'normal' : 'italic');
    else if (style === 'underline') textObj.set('underline', !textObj.underline);
    else textObj.set(style, value);
    c.renderAll();
    c.fire('object:modified');
  };

  const applyColorToSelection = (color: string) => {
    setActiveColor(color);
    const c = fabricRef.current;
    if (!c) return;
    if (selectedObject) {
      const role = (selectedObject as any).data?.role;
      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        selectedObject.set('fill', color);
      } else if (role === 'highlight') {
        selectedObject.set('fill', withAlpha(color, 0.4));
      } else if (role === 'whiteout') {
        selectedObject.set('fill', color);
      } else if (selectedObject.type === 'path' || selectedObject.type === 'rect' || selectedObject.type === 'ellipse') {
        selectedObject.set('stroke', color);
        if (role === 'shape') selectedObject.set('fill', withAlpha(color, 0.12));
      } else {
        selectedObject.set('stroke', color);
      }
      c.renderAll();
      c.fire('object:modified');
    }
  };

  // ---------- Undo / redo ----------
  const restoreFromHistory = (page: number, index: number) => {
    const c = fabricRef.current;
    const entry = historyRef.current[page];
    if (!c || !entry || index < 0 || index >= entry.stack.length) return;
    isRestoringRef.current = true;
    c.loadFromJSON(entry.stack[index])
      .then(() => {
        c.renderAll();
        isRestoringRef.current = false;
        historyRef.current[page] = { ...entry, index };
        setCanUndo(index > 0);
        setCanRedo(index < entry.stack.length - 1);
      })
      .catch(() => {
        isRestoringRef.current = false;
      });
  };
  const undo = () => {
    const entry = historyRef.current[pageNumber];
    if (!entry || entry.index <= 0) return;
    restoreFromHistory(pageNumber, entry.index - 1);
  };
  const redo = () => {
    const entry = historyRef.current[pageNumber];
    if (!entry || entry.index >= entry.stack.length - 1) return;
    restoreFromHistory(pageNumber, entry.index + 1);
  };

  // ---------- Zoom (CSS-only; document coordinates never change) ----------
  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, +(s + 0.1).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, +(s - 0.1).toFixed(2)));

  useEffect(() => {
    const el = containerRef.current;
    const fit = () => {
      const compact = window.innerWidth < 768;
      setIsCompact(compact);
      if (!compact || !el) return;
      const available = Math.max(240, el.clientWidth - 24);
      const next = Math.min(1, available / nativePageSize.width);
      setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, +next.toFixed(2))));
    };
    fit();
    window.addEventListener('resize', fit);
    const obs = el ? new ResizeObserver(fit) : null;
    if (el) obs?.observe(el);
    return () => {
      window.removeEventListener('resize', fit);
      obs?.disconnect();
    };
  }, [nativePageSize.width, pdfBytes]);

  // ---------- Page management (insert / duplicate / delete) ----------
  const resetPageCaches = () => {
    pageProxyRef.current = {};
    textContentRef.current = {};
  };

  const insertBlankPageAfterCurrent = async () => {
    if (!numPages || !pdfBytes) return;
    setIsBusy(true);
    try {
      persistCurrentPage();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const refPage = pdfDoc.getPage(Math.min(pageNumber - 1, pdfDoc.getPageCount() - 1));
      const { width, height } = refPage.getSize();
      const insertIndex = pageNumber; // 0-based index right after the current page
      pdfDoc.insertPage(insertIndex, [width, height]);
      const newBytes = await pdfDoc.save();
      const newPageNum = insertIndex + 1;

      pageDataRef.current = shiftRecordFrom(pageDataRef.current, newPageNum, 1);
      historyRef.current = shiftRecordFrom(historyRef.current, newPageNum, 1);
      resetPageCaches();

      setPdfBytes(newBytes);
      setNumPages(pdfDoc.getPageCount());
      setPageNumber(newPageNum);
    } finally {
      setIsBusy(false);
    }
  };

  const duplicateCurrentPage = async () => {
    if (!numPages || !pdfBytes) return;
    setIsBusy(true);
    try {
      persistCurrentPage();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const srcIndex = pageNumber - 1;
      const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [srcIndex]);
      pdfDoc.insertPage(srcIndex + 1, copiedPage);
      const newBytes = await pdfDoc.save();
      const newPageNum = srcIndex + 2;

      pageDataRef.current = shiftRecordFrom(pageDataRef.current, newPageNum, 1);
      historyRef.current = shiftRecordFrom(historyRef.current, newPageNum, 1);
      // Carry the source page's annotations over to its duplicate.
      const sourceAnnotations = pageDataRef.current[pageNumber];
      if (sourceAnnotations) pageDataRef.current[newPageNum] = sourceAnnotations;
      delete historyRef.current[newPageNum];
      resetPageCaches();

      setPdfBytes(newBytes);
      setNumPages(pdfDoc.getPageCount());
      setPageNumber(newPageNum);
    } finally {
      setIsBusy(false);
    }
  };

  const deletePage = async (page: number) => {
    if (!numPages || !pdfBytes) return;
    if (numPages <= 1) {
      window.alert("This is the only page left — a PDF needs at least one.");
      return;
    }
    setIsBusy(true);
    try {
      if (page === pageNumber) persistCurrentPage();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.removePage(page - 1);
      const newBytes = await pdfDoc.save();
      const newCount = pdfDoc.getPageCount();

      pageDataRef.current = removePageAndShift(pageDataRef.current, page);
      historyRef.current = removePageAndShift(historyRef.current, page);
      resetPageCaches();

      setPdfBytes(newBytes);
      setNumPages(newCount);
      setPageNumber((p) => Math.min(p > page ? p - 1 : p, newCount));
    } finally {
      setIsBusy(false);
    }
  };

  // ---------- Save / export ----------
  const buildEditedPdf = useCallback(async () => {
    const c = fabricRef.current;
    if (!c || !numPages || !pdfBytes) return null;
    const active = c.getActiveObject() as fabric.IText | undefined;
    if (active?.isEditing) active.exitEditing();
    c.discardActiveObject();
    c.requestRenderAll();
    pageDataRef.current[pageNumber] = JSON.stringify(c.toObject(JSON_PROPS));

    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const pages = pdfDoc.getPages();
    const embedded = {
      sans: await pdfDoc.embedFont(StandardFonts.Helvetica),
      sansBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      serif: await pdfDoc.embedFont(StandardFonts.TimesRoman),
      serifBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
      mono: await pdfDoc.embedFont(StandardFonts.Courier),
      monoBold: await pdfDoc.embedFont(StandardFonts.CourierBold),
    };
    const sourceFonts = new Map<string, Awaited<ReturnType<typeof pdfDoc.embedFont>>>();
    const sourceFontFor = async (key: string) => {
      if (!key) return null;
      if (sourceFonts.has(key)) return sourceFonts.get(key) ?? null;
      const bytes = pdfFontBytesRef.current[key];
      if (!bytes) return null;
      try {
        let font: Awaited<ReturnType<typeof pdfDoc.embedFont>>;
        try {
          font = await pdfDoc.embedFont(bytes.slice(), { subset: true });
        } catch {
          font = await pdfDoc.embedFont(bytes.slice());
        }
        sourceFonts.set(key, font);
        return font;
      } catch {
        return null;
      }
    };
    if (document.fonts?.ready) await document.fonts.ready;

    for (let i = 0; i < pages.length; i++) {
      const pageIndex = i + 1;
      const json = pageDataRef.current[pageIndex];
      if (!json) continue;

      const parsed = JSON.parse(json);
      const objects: any[] = parsed.objects || [];
      if (objects.length === 0) continue;

      const pdfPage = pages[i];
      const { width: pw, height: ph } = pdfPage.getSize();
      const factorX = pw / nativePageSize.width;
      const factorY = ph / nativePageSize.height;
      const rasterObjects: any[] = [];

      const drawEditedLine = async (textObj: any, cover: any) => {
        const scaleY = textObj.scaleY || 1;
        const pdfSize = textObj.data?.pdfFontSize || textObj.fontSize || 12;
        const size = Math.max(1, pdfSize * scaleY * factorY);
        const topShift = (textObj.top || 0) - (textObj.data?.topAtCreate ?? textObj.top ?? 0);
        const baselineFromTop = (textObj.data?.baseline ?? (textObj.top || 0) + pdfSize * FABRIC_BASELINE_RATIO) + topShift * scaleY;
        const kind: PdfFontKind = textObj.data?.fontKind === 'serif' || textObj.data?.fontKind === 'mono' ? textObj.data.fontKind : 'sans';
        const bold = textObj.fontWeight === 'bold' || textObj.data?.bold;
        const sourceFont = await sourceFontFor(textObj.data?.fontKey || '');
        const fallback =
          kind === 'serif' ? (bold ? embedded.serifBold : embedded.serif) : kind === 'mono' ? (bold ? embedded.monoBold : embedded.mono) : bold ? embedded.sansBold : embedded.sans;
        const font = sourceFont || fallback;
        const value = String(textObj.text || '').replace(/\n/g, '');
        if (cover) {
          const cw = (cover.width || 0) * (cover.scaleX || 1) * factorX;
          const ch = (cover.height || 0) * (cover.scaleY || 1) * factorY;
          pdfPage.drawRectangle({
            x: (cover.left || 0) * factorX,
            y: ph - (cover.top || 0) * factorY - ch,
            width: Math.max(cw, 1),
            height: Math.max(ch, 1),
            color: rgb(1, 1, 1),
            borderWidth: 0,
          });
        }
        if (!value) return;
        const x = (textObj.left || 0) * factorX;
        const y = ph - baselineFromTop * factorY;
        pdfPage.drawText(value, { x, y, size, font, color: fillToRgb(textObj.fill) });
      };

      const whiteouts = new Map<string, any>();
      objects.forEach((obj) => {
        if (obj?.data?.role === 'pdf-whiteout' && obj.data.pairId) whiteouts.set(obj.data.pairId, obj);
      });

      for (const obj of objects) {
        if (obj?.data?.isLink) continue;
        if (obj?.data?.role === 'pdf-whiteout') continue;
        if (obj?.data?.role === 'pdf-text') {
          try {
            await drawEditedLine(obj, whiteouts.get(obj.data.pairId));
          } catch {
            rasterObjects.push(obj);
            const cover = whiteouts.get(obj.data.pairId);
            if (cover) rasterObjects.push(cover);
          }
          continue;
        }
        rasterObjects.push(obj);
      }

      if (rasterObjects.length > 0) {
        const offscreenEl = document.createElement('canvas');
        const offCanvas = new fabric.Canvas(offscreenEl, {
          width: nativePageSize.width,
          height: nativePageSize.height,
          enableRetinaScaling: false,
          backgroundColor: 'rgba(0,0,0,0)',
        });
        await offCanvas.loadFromJSON({ ...parsed, objects: rasterObjects });
        offCanvas.discardActiveObject();
        offCanvas.getObjects().forEach((o) => {
          o.set({ hasBorders: false, hasControls: false, shadow: null });
          if ((o as any).data?.isLink) o.set({ opacity: 0 });
        });
        offCanvas.renderAll();
        const dataUrl = offCanvas.toDataURL({ format: 'png', multiplier: 2 });
        const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngBytes);
        pdfPage.drawImage(pngImage, { x: 0, y: 0, width: pw, height: ph });
        offCanvas.dispose();
      }

      for (const link of objects.filter((o) => o?.data?.isLink)) {
        try {
          const lw = (link.width ?? 0) * (link.scaleX ?? 1) * factorX;
          const lh = (link.height ?? 0) * (link.scaleY ?? 1) * factorY;
          const lx = (link.left ?? 0) * factorX;
          const ly = ph - (link.top ?? 0) * factorY - lh;
          addLinkAnnotation(pdfDoc, pdfPage, { x: lx, y: ly, width: lw, height: lh }, link.data.url);
        } catch {
          // Skip a malformed link rather than aborting the whole file.
        }
      }
    }

    return pdfDoc.save();
  }, [numPages, pageNumber, nativePageSize, pdfBytes]);

  const downloadPdf = (bytes: Uint8Array) => {
    const arrayBuffer = new Uint8Array(bytes).buffer as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '') + '-edited.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePDF = useCallback(async () => {
    if (isExporting || isSaving) return;
    setIsSaving(true);
    try {
      const bytes = await buildEditedPdf();
      if (!bytes) return;
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1600);
    } catch (err) {
      console.error(err);
      window.alert('Could not save this PDF. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [buildEditedPdf, isExporting, isSaving]);

  const exportPDF = useCallback(async () => {
    if (isExporting || isSaving) return;
    setIsExporting(true);
    try {
      const bytes = await buildEditedPdf();
      if (!bytes) return;
      downloadPdf(bytes);
    } catch (err) {
      console.error(err);
      window.alert('Could not export this PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [buildEditedPdf, file.name, isExporting, isSaving]);

  function addLinkAnnotation(
    pdfDoc: PDFDocument,
    page: ReturnType<PDFDocument['getPages']>[number],
    rect: { x: number; y: number; width: number; height: number },
    url: string
  ) {
    const linkDict = pdfDoc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
      Border: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(url),
      },
    });
    const linkRef = pdfDoc.context.register(linkDict);
    const annotsKey = PDFName.of('Annots');
    const existing = (page as any).node.get(annotsKey);
    if (existing instanceof PDFArray) {
      existing.push(linkRef);
    } else {
      (page as any).node.set(annotsKey, pdfDoc.context.obj([linkRef]));
    }
  }

  const goToPage = (n: number) => {
    if (!numPages) return;
    setPageNumber(Math.min(Math.max(1, n), numPages));
  };

  const displayWidth = nativePageSize.width * scale;
  const displayHeight = nativePageSize.height * scale;

  if (!pdfBytes || !viewerFileSource || !thumbFileSource) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-50">
        <div className="flex items-center gap-3 text-neutral-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading document…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-neutral-50 text-neutral-900">
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageChosen} />

      {/* Top toolbar */}
      <div className="sticky top-0 z-50 flex flex-col gap-2 border-b border-neutral-200 bg-white px-2 py-2 shadow-sm md:h-14 md:flex-row md:items-center md:justify-between md:gap-4 md:px-4 md:py-0">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-1">
          <ToolButton icon={<MousePointer2 className="h-3.5 w-3.5" />} label="Select" hint="Click text to edit or cut it" active={activeTool === 'select'} onClick={() => selectTool('select')} />
          <ToolButton icon={<Type className="h-3.5 w-3.5" />} label="Add Text" active={activeTool === 'text'} onClick={() => selectTool('text')} />
          <ToolButton icon={<Highlighter className="h-3.5 w-3.5" />} label="Highlight" active={activeTool === 'highlight'} onClick={() => selectTool('highlight')} />
          <ToolButton icon={<Eraser className="h-3.5 w-3.5" />} label="Whiteout" active={activeTool === 'whiteout'} onClick={() => selectTool('whiteout')} />
          <ToolButton icon={<PenTool className="h-3.5 w-3.5" />} label="Draw" active={activeTool === 'draw'} onClick={() => selectTool('draw')} />
          <ToolButton icon={<Square className="h-3.5 w-3.5" />} label="Rectangle" active={activeTool === 'rect'} onClick={() => selectTool('rect')} />
          <ToolButton icon={<Circle className="h-3.5 w-3.5" />} label="Ellipse" active={activeTool === 'ellipse'} onClick={() => selectTool('ellipse')} />
          <ToolButton icon={<LinkIcon className="h-3.5 w-3.5" />} label="Link" active={activeTool === 'link'} onClick={() => selectTool('link')} />
          <ToolButton icon={<ImageIcon className="h-3.5 w-3.5" />} label="Image" active={false} onClick={triggerImagePicker} />

          <div className="mx-1 h-4 w-px bg-neutral-200" />
          <button onClick={undo} disabled={!canUndo} className="rounded-md p-1.5 text-neutral-600 transition-all hover:bg-white disabled:opacity-30">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={redo} disabled={!canRedo} className="rounded-md p-1.5 text-neutral-600 transition-all hover:bg-white disabled:opacity-30">
            <Redo2 className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-neutral-200" />
          {SWATCHES.map((color) => (
            <button
              key={color}
              onClick={() => applyColorToSelection(color)}
              className={`h-5 w-5 rounded-full border transition-transform ${
                activeColor === color ? 'scale-110 ring-2 ring-offset-1 ring-amber-500' : 'border-neutral-300'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`color ${color}`}
            />
          ))}

          {activeTool === 'draw' && (
            <>
              <div className="mx-1 h-4 w-px bg-neutral-200" />
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBrushWidth(b.value)}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition-all ${
                    brushWidth === b.value ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
              <input type="range" min={1} max={20} value={brushWidth} onChange={(e) => setBrushWidth(Number(e.target.value))} className="w-16 accent-neutral-900" />
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            onClick={savePDF}
            disabled={isSaving || isExporting}
            className="flex items-center gap-2 rounded-md bg-[#DC4C2F] px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#c23f26] disabled:opacity-60 sm:px-4"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {isSaving ? 'Saving…' : savedFlash ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={exportPDF}
            disabled={isSaving || isExporting}
            className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50 disabled:opacity-60 sm:px-4"
          >
            {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {isExporting ? 'Exporting…' : 'Export'}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {/* Sidebar / thumbnails with page management */}
        <div className="order-2 flex max-h-32 shrink-0 gap-2 overflow-x-auto border-t border-neutral-200 bg-white p-2 md:order-none md:max-h-none md:w-56 md:flex-col md:overflow-y-auto md:border-r md:border-t-0 md:p-3">
          <div className="mb-3 hidden items-center justify-between px-1 md:flex">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Pages</h3>
            <button
              onClick={insertBlankPageAfterCurrent}
              disabled={isBusy}
              title="Insert a blank page after the current one"
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            >
              <FilePlus2 className="h-3 w-3" /> Add
            </button>
          </div>
          <Document file={thumbFileSource} loading={null}>
            <div className="flex gap-2 md:block md:space-y-3">
              {Array.from(new Array(numPages ?? 0), (_, index) => {
                const pn = index + 1;
                return (
                  <div
                    key={pn}
                    onMouseEnter={() => setHoveredThumb(pn)}
                    onMouseLeave={() => setHoveredThumb((h) => (h === pn ? null : h))}
                    onClick={() => goToPage(pn)}
                    className={`relative shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                      pageNumber === pn ? 'border-[#DC4C2F] shadow-lg' : 'border-transparent hover:border-neutral-200'
                    }`}
                  >
                    <Page pageNumber={pn} width={isCompact ? 72 : 196} renderAnnotationLayer={false} renderTextLayer={false} loading={null} />
                    <div className="bg-neutral-50 py-1 text-center text-[10px] font-semibold text-neutral-400">{pn}</div>
                    {hoveredThumb === pn && (
                      <div className="absolute right-1 top-1 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToPage(pn);
                            duplicateCurrentPage();
                          }}
                          title="Duplicate page"
                          className="rounded bg-white/90 p-1 text-neutral-600 shadow hover:bg-white"
                        >
                          <CopyPlus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePage(pn);
                          }}
                          title="Delete page"
                          className="rounded bg-white/90 p-1 text-red-500 shadow hover:bg-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Document>
        </div>

        {/* Editor area */}
        <div className="flex min-h-0 grow flex-col items-start gap-4 overflow-auto bg-neutral-100/60 p-3 md:items-center md:p-12" ref={containerRef}>
          <div className="relative overflow-visible bg-white shadow-2xl" style={{ width: displayWidth, height: displayHeight }}>
            {selectedObject && (
              <div
                className="absolute z-50 flex max-w-[calc(100vw-2rem)] items-center gap-0.5 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-xl"
                style={{ top: toolbarPosition.top * scale, left: toolbarPosition.left * scale, transform: 'translateX(-50%)' }}
              >
                {selectedObject.type === 'i-text' && (
                  <>
                    <button onClick={() => updateTextStyle('fontWeight', null)} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100">
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => updateTextStyle('fontStyle', null)} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100">
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => updateTextStyle('underline', null)} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100">
                      <Underline className="h-3.5 w-3.5" />
                    </button>
                    <div className="mx-0.5 h-4 w-px bg-neutral-200" />
                    <button
                      onClick={() => updateTextStyle('fontSize', ((selectedObject as fabric.IText).fontSize ?? 16) + 2)}
                      className="rounded p-1.5 text-[10px] font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      T↑
                    </button>
                    <button
                      onClick={() => updateTextStyle('fontSize', Math.max(6, ((selectedObject as fabric.IText).fontSize ?? 16) - 2))}
                      className="rounded p-1.5 text-[10px] font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      T↓
                    </button>
                    <div className="mx-0.5 h-4 w-px bg-neutral-200" />
                    <button onClick={cutObject} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Cut">
                      <Scissors className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <button onClick={copyObject} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Copy">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button onClick={pasteObject} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Paste">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                </button>
                <button onClick={duplicateObject} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Duplicate">
                  <CopyPlus className="h-3.5 w-3.5" />
                </button>
                <div className="mx-0.5 h-4 w-px bg-neutral-200" />
                <button onClick={bringForward} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Bring forward">
                  <MoveUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={sendBackward} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Send backward">
                  <MoveDown className="h-3.5 w-3.5" />
                </button>
                <div className="mx-0.5 h-4 w-px bg-neutral-200" />
                <button onClick={lockObject} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Lock">
                  <Lock className="h-3.5 w-3.5" />
                </button>
                <button onClick={unlockAll} className="rounded p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100" title="Unlock all">
                  <Unlock className="h-3.5 w-3.5" />
                </button>
                <button onClick={deleteSelected} className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Fixed at native PDF point size; zoom is a pure CSS transform so annotation
                coordinates never need to be rescaled when the zoom level changes. */}
            <div
              style={{
                width: nativePageSize.width,
                height: nativePageSize.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <div className="absolute inset-0 z-0">
                <Document file={viewerFileSource} options={PDFJS_DOCUMENT_OPTIONS} onLoadSuccess={onDocumentLoadSuccess} loading={<PageSkeleton width={nativePageSize.width} height={nativePageSize.height} />}>
                  <Page
                    pageNumber={pageNumber}
                    width={nativePageSize.width}
                    onLoadSuccess={onPageLoadSuccess}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={<PageSkeleton width={nativePageSize.width} height={nativePageSize.height} />}
                  />
                </Document>
              </div>
              <div className={`absolute inset-0 z-10 ${activeTool === 'select' || activeTool === 'text' ? 'cursor-text' : 'cursor-crosshair'}`}>
                <canvas ref={setCanvasEl} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating page + zoom controls */}
        <div className="fixed bottom-36 left-1/2 z-50 flex max-w-[calc(100%-1rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1.5 shadow-lg md:bottom-6 md:left-auto md:right-6 md:max-w-none md:translate-x-0">
          <button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} className="rounded-full p-1.5 hover:bg-neutral-100 disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-16 px-1 text-center text-xs font-semibold text-neutral-500">
            Page {pageNumber} / {numPages ?? '…'}
          </span>
          <button onClick={() => goToPage(pageNumber + 1)} disabled={!numPages || pageNumber >= numPages} className="rounded-full p-1.5 hover:bg-neutral-100 disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-neutral-200" />
          <button onClick={insertBlankPageAfterCurrent} disabled={isBusy} title="Insert blank page after this one" className="rounded-full p-1.5 hover:bg-neutral-100 disabled:opacity-40">
            <Plus className="h-4 w-4" />
          </button>
          <button onClick={duplicateCurrentPage} disabled={isBusy} title="Duplicate this page" className="rounded-full p-1.5 hover:bg-neutral-100 disabled:opacity-40">
            <CopyPlus className="h-4 w-4" />
          </button>
          <button onClick={() => deletePage(pageNumber)} disabled={isBusy} title="Delete this page" className="rounded-full p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-40">
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-neutral-200" />
          <button onClick={zoomOut} disabled={scale <= MIN_SCALE} className="rounded-full p-1.5 hover:bg-neutral-100 disabled:opacity-30">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs font-semibold text-neutral-500">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} disabled={scale >= MAX_SCALE} className="rounded-full p-1.5 hover:bg-neutral-100 disabled:opacity-30">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={hint ?? label}
      className={`flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-bold transition-all sm:px-3 ${
        active ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-600 hover:bg-white'
      }`}
    >
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function PageSkeleton({ width, height }: { width: number; height: number }) {
  return <div className="animate-pulse bg-neutral-200" style={{ width, height }} />;
}
