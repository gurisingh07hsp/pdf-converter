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
import { PDFDocument, PDFName, PDFString, PDFArray } from 'pdf-lib';
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

interface TextRun {
  str: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

const SWATCHES = ['#171717', '#DC4C2F', '#2563EB', '#16A34A', '#D9A404', '#FFFFFF'];
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const BRUSH_SIZES = [
  { label: 'Slim', value: 2 },
  { label: 'Medium', value: 5 },
  { label: 'Thick', value: 10 },
];
const JSON_PROPS = ['data'];
// When a click-to-edit text replacement is created, its whiteout backing rect is offset from
// the text by this many points on each side. Kept as a constant so the pieces can be re-synced
// whenever either one is dragged or scaled.
const EDIT_PAIR_PAD = 1;

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
  const [isBusy, setIsBusy] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [nativePageSize, setNativePageSize] = useState({ width: 612, height: 792 });
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeToolRef = useRef<Tool>('select');
  const activeColorRef = useRef(activeColor);
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

  // Undo/redo history, scoped per page
  const historyRef = useRef<Record<number, { stack: string[]; index: number }>>({});
  const clipboardRef = useRef<fabric.Object | null>(null);
  const isRestoringRef = useRef(false);

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
      if (info.role === 'text') {
        partner.set({
          left: (target.left ?? 0) - EDIT_PAIR_PAD,
          top: (target.top ?? 0) - EDIT_PAIR_PAD,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
        });
      } else {
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
      if (isRestoringRef.current) return;
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

    // Click-to-place / click-directly-on-text interactions
    fabricCanvas.on('mouse:down', (opt) => {
      const tool = activeToolRef.current;
      if (tool === 'draw') return;
      if (opt.target) return; // let clicks on existing objects behave normally (select/drag)
      const pointer = fabricCanvas.getScenePoint(opt.e);

      if (tool === 'select') {
        // The default tool: clicking directly on the PDF's own text opens it for editing.
        editTextAtPoint(pointer.x, pointer.y);
      } else if (tool === 'text') {
        placeText(pointer.x, pointer.y);
        setActiveTool('select');
      } else if (tool === 'whiteout') {
        placeWhiteout(pointer.x, pointer.y);
        setActiveTool('select');
      } else if (tool === 'highlight') {
        placeHighlight(pointer.x, pointer.y);
        setActiveTool('select');
      } else if (tool === 'rect') {
        placeShape(pointer.x, pointer.y, 'rect');
        setActiveTool('select');
      } else if (tool === 'ellipse') {
        placeShape(pointer.x, pointer.y, 'ellipse');
        setActiveTool('select');
      } else if (tool === 'link') {
        placeLink(pointer.x, pointer.y);
        setActiveTool('select');
      }
    });

    if (!historyRef.current[currentPageRef.current]) {
      const json = JSON.stringify(fabricCanvas.toObject(JSON_PROPS));
      historyRef.current[currentPageRef.current] = { stack: [json], index: 0 };
    }

    return () => {
      fabricCanvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativePageSize.width, nativePageSize.height]);

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
      c.loadFromJSON(saved, afterLoad);
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
    pageProxyRef.current[pageNumber] = page;
    if (!textContentRef.current[pageNumber]) {
      page.getTextContent().then((tc: any) => {
        textContentRef.current[pageNumber] = tc;
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
        const fontHeight = Math.hypot(tx[2], tx[3]) || 10;
        const scaleFactor = it.height ? fontHeight / it.height : 1;
        return {
          str: it.str,
          left: tx[4],
          top: tx[5] - fontHeight,
          width: it.width * scaleFactor,
          height: fontHeight,
        } as TextRun;
      });
  }

  // ---------- Tool actions ----------
  const placeText = (x: number, y: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const text = new fabric.IText('Type here', {
      left: x,
      top: y,
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

  // Clicking directly on the PDF's own text: whites it out and drops an editable copy in its
  // place, so the user can retype, delete (cut), or restyle the original document text.
  const editTextAtPoint = (x: number, y: number): boolean => {
    const c = fabricRef.current;
    if (!c) return false;
    const runs = getTextRuns(pageNumber);
    const hit = runs.find((r) => x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height);
    if (!hit) return false;

    const pad = 1;
    const whiteout = new fabric.Rect({
      left: hit.left - pad,
      top: hit.top - pad,
      width: hit.width + pad * 2,
      height: hit.height + pad * 2,
      fill: '#ffffff',
      selectable: true,
    });
    const editText = new fabric.IText(hit.str, {
      left: hit.left,
      top: hit.top,
      fontSize: Math.max(6, hit.height * 0.82),
      fontFamily: 'sans-serif',
      fill: '#171717',
    });
    c.add(whiteout);
    c.add(editText);
    c.setActiveObject(editText);
    editText.enterEditing();
    editText.selectAll();
    c.renderAll();
    return true;
  };

  const placeWhiteout = (x: number, y: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const rect = new fabric.Rect({ left: x, top: y, fill: '#ffffff', width: 160, height: 30, stroke: '#e5e7eb', strokeWidth: 1 });
    c.add(rect);
    c.setActiveObject(rect);
    c.renderAll();
  };

  const placeHighlight = (x: number, y: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const rect = new fabric.Rect({ left: x, top: y, fill: 'rgba(255, 235, 59, 0.4)', width: 160, height: 22 });
    c.add(rect);
    c.setActiveObject(rect);
    c.renderAll();
  };

  const placeShape = (x: number, y: number, kind: 'rect' | 'ellipse') => {
    const c = fabricRef.current;
    if (!c) return;
    const shared = { left: x, top: y, fill: 'rgba(220, 76, 47, 0.12)', stroke: activeColorRef.current, strokeWidth: 2 };
    const shape =
      kind === 'rect'
        ? new fabric.Rect({ ...shared, width: 120, height: 60 })
        : new fabric.Ellipse({ ...shared, rx: 60, ry: 34 });
    c.add(shape);
    c.setActiveObject(shape);
    c.renderAll();
  };

  const placeLink = (x: number, y: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const url = window.prompt('Link URL (include https://)');
    if (!url) return;
    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: 140,
      height: 24,
      fill: 'rgba(37, 99, 235, 0.08)',
      stroke: '#2563EB',
      strokeDashArray: [4, 3],
      strokeWidth: 1.5,
    });
    (rect as any).data = { isLink: true, url };
    c.add(rect);
    c.setActiveObject(rect);
    c.renderAll();
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
        img.set({ left: 80, top: 80 });
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
      if (selectedObject.type === 'i-text') selectedObject.set('fill', color);
      else selectedObject.set('stroke', color);
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
    c.loadFromJSON(entry.stack[index], () => {
      c.renderAll();
      isRestoringRef.current = false;
      historyRef.current[page] = { ...entry, index };
      setCanUndo(index > 0);
      setCanRedo(index < entry.stack.length - 1);
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

  // ---------- Export ----------
  const exportPDF = useCallback(async () => {
    const c = fabricRef.current;
    if (!c || !numPages || !pdfBytes) return;
    setIsExporting(true);
    try {
      pageDataRef.current[pageNumber] = JSON.stringify(c.toObject(JSON_PROPS));

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const pageIndex = i + 1;
        const json = pageDataRef.current[pageIndex];
        if (!json) continue;

        const pdfPage = pages[i];
        const { width: pw, height: ph } = pdfPage.getSize();

        const offscreenEl = document.createElement('canvas');
        const offCanvas = new fabric.Canvas(offscreenEl, { width: pw, height: ph });
        const parsed = JSON.parse(json);
        const linkObjects: any[] = (parsed.objects || []).filter((o: any) => o?.data?.isLink);

        await new Promise<void>((resolve) => {
          offCanvas.loadFromJSON(json, () => {
            const factor = pw / nativePageSize.width;
            offCanvas.getObjects().forEach((o) => {
              // Hide link boxes from the rasterized overlay — they become real annotations below.
              if ((o as any).data?.isLink) {
                o.set({ opacity: 0 });
                return;
              }
              o.set({
                left: (o.left ?? 0) * factor,
                top: (o.top ?? 0) * factor,
                scaleX: (o.scaleX ?? 1) * factor,
                scaleY: (o.scaleY ?? 1) * factor,
              });
              o.setCoords();
            });
            offCanvas.renderAll();
            resolve();
          });
        });

        const dataUrl = offCanvas.toDataURL({ format: 'png', multiplier: 2 });
        const pngBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngBytes);
        pdfPage.drawImage(pngImage, { x: 0, y: 0, width: pw, height: ph });
        offCanvas.dispose();

        const factor = pw / nativePageSize.width;
        for (const link of linkObjects) {
          try {
            const lw = (link.width ?? 0) * (link.scaleX ?? 1) * factor;
            const lh = (link.height ?? 0) * (link.scaleY ?? 1) * factor;
            const lx = (link.left ?? 0) * factor;
            const ly = ph - (link.top ?? 0) * factor - lh;
            addLinkAnnotation(pdfDoc, pdfPage, { x: lx, y: ly, width: lw, height: lh }, link.data.url);
          } catch {
            // Skip a malformed link rather than aborting the whole export.
          }
        }
      }

      const outBytes = await pdfDoc.save();
      const arrayBuffer = new Uint8Array(outBytes).buffer as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '') + '-edited.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }, [file, numPages, pageNumber, nativePageSize, pdfBytes]);

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
    <div className="flex h-screen flex-col bg-neutral-50 text-neutral-900">
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageChosen} />

      {/* Top toolbar */}
      <div className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
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

        <button
          onClick={exportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-md bg-[#DC4C2F] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#c23f26] disabled:opacity-60"
        >
          {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          {isExporting ? 'Exporting…' : 'Export PDF'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / thumbnails with page management */}
        <div className="w-56 overflow-y-auto border-r border-neutral-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between px-1">
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
            <div className="space-y-3">
              {Array.from(new Array(numPages ?? 0), (_, index) => {
                const pn = index + 1;
                return (
                  <div
                    key={pn}
                    onMouseEnter={() => setHoveredThumb(pn)}
                    onMouseLeave={() => setHoveredThumb((h) => (h === pn ? null : h))}
                    onClick={() => goToPage(pn)}
                    className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                      pageNumber === pn ? 'border-[#DC4C2F] shadow-lg' : 'border-transparent hover:border-neutral-200'
                    }`}
                  >
                    <Page pageNumber={pn} width={196} renderAnnotationLayer={false} renderTextLayer={false} loading={null} />
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
        <div className="flex grow flex-col items-center gap-4 overflow-auto bg-neutral-100/60 p-12" ref={containerRef}>
          <div className="relative overflow-visible bg-white shadow-2xl" style={{ width: displayWidth, height: displayHeight }}>
            {selectedObject && (
              <div
                className="absolute z-50 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-xl"
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
                <Document file={viewerFileSource} onLoadSuccess={onDocumentLoadSuccess} loading={<PageSkeleton width={nativePageSize.width} height={nativePageSize.height} />}>
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
              <div className={`absolute inset-0 z-10 ${activeTool === 'select' ? 'cursor-text' : ''}`}>
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating page + zoom controls */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1.5 shadow-lg">
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
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
        active ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-600 hover:bg-white'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function PageSkeleton({ width, height }: { width: number; height: number }) {
  return <div className="animate-pulse bg-neutral-200" style={{ width, height }} />;
}
