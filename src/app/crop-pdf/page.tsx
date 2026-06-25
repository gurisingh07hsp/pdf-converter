'use client';

import { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { ShieldCheck, Zap, Cloud, Download, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { getRelevantTools, Tool } from "@/lib/tools";
// Configure worker in client-only code

interface CropState {
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  isResizing: boolean;
  resizeHandle: string | null;
  startX: number;
  startY: number;
  startCropX: number;
  startCropY: number;
  startCropWidth: number;
  startCropHeight: number;
}

export default function CropPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploaded' | 'processing' | 'success' | 'error'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1.5);
  const [cropAll, setCropAll] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load pdfjs-lib dynamically on client
  useEffect(() => {
    let isMounted = true;
    const loadPdfJs = async () => {
      try {
        const lib = await import('pdfjs-dist');
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
        if (isMounted) {
          setPdfjsLib(lib);
        }
      } catch (error) {
        console.error('Failed to load pdfjs-dist:', error);
        if (isMounted) {
          setErrorMessage('Failed to load PDF viewer');
        }
      }
    };
    loadPdfJs();
    return () => { isMounted = false; };
  }, []);

  const initialCropState: CropState = {
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    isDragging: false,
    isResizing: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    startCropX: 0,
    startCropY: 0,
    startCropWidth: 0,
    startCropHeight: 0,
  };

  const [crop, setCrop] = useState<CropState>(initialCropState);
  const relevantTools: Tool[] = getRelevantTools('/crop-pdf');

  const handleFileSelect = async (files: File[]) => {
    setErrorMessage(null);
    const selectedFile = files[0];
    setFile(selectedFile);
    setStatus('uploaded');
    setCurrentPage(1);
    await loadPDF(selectedFile);
  };

  const loadPDF = async (pdfFile: File) => {
    if (!pdfjsLib) return;
    try {
      console.log('Loading PDF...');
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      await renderPage(1);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setStatus('error');
      setErrorMessage(`Failed to load PDF: ${(error as Error)?.message || 'Unknown error'}`);
    }
  };

  const renderPage = async (pageNumber: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      console.log('Rendering page:', pageNumber);
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: scale });
      
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageSize({ width: viewport.width, height: viewport.height });
      
      setCrop(prev => ({
        ...prev,
        x: viewport.width * 0.1,
        y: viewport.height * 0.1,
        width: viewport.width * 0.8,
        height: viewport.height * 0.8,
      }));
      
      const context = canvas.getContext('2d');
      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
        console.log('Page rendered');
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      setErrorMessage(`Failed to render page: ${(error as Error)?.message || 'Unknown error'}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
      renderPage(newPage);
    }
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent, handleType: string | null = null) => {
    e.preventDefault();
    const { x, y } = getMousePosition(e);
    if (handleType) {
      setCrop(prev => ({
        ...prev,
        isResizing: true,
        resizeHandle: handleType,
        startX: x,
        startY: y,
        startCropX: prev.x,
        startCropY: prev.y,
        startCropWidth: prev.width,
        startCropHeight: prev.height,
      }));
    } else {
      setCrop(prev => ({
        ...prev,
        isDragging: true,
        startX: x,
        startY: y,
        startCropX: prev.x,
        startCropY: prev.y,
      }));
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!crop.isDragging && !crop.isResizing) return;
    const { x, y } = getMousePosition(e);
    const dx = x - crop.startX;
    const dy = y - crop.startY;

    setCrop(prev => {
      if (prev.isDragging) {
        let newX = prev.startCropX + dx;
        let newY = prev.startCropY + dy;
        newX = Math.max(0, Math.min(pageSize.width - prev.width, newX));
        newY = Math.max(0, Math.min(pageSize.height - prev.height, newY));
        return { ...prev, x: newX, y: newY };
      }
      if (prev.isResizing && prev.resizeHandle) {
        let newX = prev.startCropX;
        let newY = prev.startCropY;
        let newWidth = prev.startCropWidth;
        let newHeight = prev.startCropHeight;
        switch (prev.resizeHandle) {
          case 'top-left':
            newX = Math.min(prev.startCropX + prev.startCropWidth - 20, Math.max(0, prev.startCropX + dx));
            newY = Math.min(prev.startCropY + prev.startCropHeight - 20, Math.max(0, prev.startCropY + dy));
            newWidth = prev.startCropWidth - (newX - prev.startCropX);
            newHeight = prev.startCropHeight - (newY - prev.startCropY);
            break;
          case 'top-right':
            newY = Math.min(prev.startCropY + prev.startCropHeight - 20, Math.max(0, prev.startCropY + dy));
            newWidth = Math.max(20, Math.min(pageSize.width - prev.startCropX, prev.startCropWidth + dx));
            newHeight = prev.startCropHeight - (newY - prev.startCropY);
            break;
          case 'bottom-left':
            newX = Math.min(prev.startCropX + prev.startCropWidth - 20, Math.max(0, prev.startCropX + dx));
            newWidth = prev.startCropWidth - (newX - prev.startCropX);
            newHeight = Math.max(20, Math.min(pageSize.height - prev.startCropY, prev.startCropHeight + dy));
            break;
          case 'bottom-right':
            newWidth = Math.max(20, Math.min(pageSize.width - prev.startCropX, prev.startCropWidth + dx));
            newHeight = Math.max(20, Math.min(pageSize.height - prev.startCropY, prev.startCropHeight + dy));
            break;
        }
        return { ...prev, x: newX, y: newY, width: newWidth, height: newHeight };
      }
      return prev;
    });
  };

  const handleMouseUp = () => {
    setCrop(prev => ({ ...prev, isDragging: false, isResizing: false, resizeHandle: null }));
  };

  const handleMouseLeave = () => {
    setCrop(prev => ({ ...prev, isDragging: false, isResizing: false, resizeHandle: null }));
  };

  const handleCrop = async () => {
    if (!file) return;
    setStatus('processing');
    setErrorMessage(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocLib = await PDFDocument.load(arrayBuffer);
      const pages = pdfDocLib.getPages();
      const pageRange = cropAll ? pages : [pages[currentPage - 1]];

      pageRange.forEach(page => {
        const originalWidth = page.getWidth();
        const originalHeight = page.getHeight();
        const pdfCropX = (crop.x / pageSize.width) * originalWidth;
        const pdfCropY = ((pageSize.height - crop.y - crop.height) / pageSize.height) * originalHeight;
        const pdfCropWidth = (crop.width / pageSize.width) * originalWidth;
        const pdfCropHeight = (crop.height / pageSize.height) * originalHeight;

        page.setCropBox(pdfCropX, pdfCropY, pdfCropWidth, pdfCropHeight);
        page.setMediaBox(pdfCropX, pdfCropY, pdfCropWidth, pdfCropHeight);
      });

      const pdfBytes = await pdfDocLib.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: any) {
      console.error('Crop error:', err);
      setErrorMessage(err.message || 'Failed to crop PDF');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow py-10 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2">Crop PDF</h1>
            <p className="text-gray-500 font-medium">Select the area to crop in your PDF document.</p>
          </div>

          {status === 'idle' && (
            <FileUpload 
              onUpload={handleFileSelect} 
              isProcessing={false} 
              acceptedTypes={['.pdf']}
              multiple={false}
            />
          )}

          {status === 'uploaded' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
                <div 
                  ref={containerRef} 
                  className="relative inline-block"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-border-custom rounded-xl"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                  />
                  
                  {/* Crop selection box */}
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/10"
                    style={{
                      left: crop.x,
                      top: crop.y,
                      width: crop.width,
                      height: crop.height,
                      cursor: crop.isDragging ? 'move' : 'default',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, null)}
                  >
                    {[
                      { position: 'top-left', cursor: 'nwse-resize', style: 'top-0 left-0' },
                      { position: 'top-right', cursor: 'nesw-resize', style: 'top-0 right-0' },
                      { position: 'bottom-left', cursor: 'nesw-resize', style: 'bottom-0 left-0' },
                      { position: 'bottom-right', cursor: 'nwse-resize', style: 'bottom-0 right-0' },
                    ].map((handle) => (
                      <div
                        key={handle.position}
                        className={`absolute w-4 h-4 bg-white border border-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 ${handle.style}`}
                        style={{ cursor: handle.cursor }}
                        onMouseDown={(e) => handleMouseDown(e, handle.position)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span className="font-bold text-lg">
                    Page {currentPage} of {numPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(numPages, currentPage + 1))}
                    disabled={currentPage === numPages}
                    className="p-2 bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={cropAll}
                      onChange={() => setCropAll(true)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">All Pages</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!cropAll}
                      onChange={() => setCropAll(false)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Current Page</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Instructions</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Drag the blue box to select the area to keep</li>
                    <li>• Resize using the corner handles</li>
                    <li>• Choose to crop all pages or just the current one</li>
                  </ul>
                </div>
                <button
                  onClick={handleCrop}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
                >
                  Crop PDF
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFile(null);
                    setPdfDoc(null);
                    setCrop(initialCropState);
                  }}
                  className="w-full text-gray-400 hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Choose Another File
                </button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">In Progress</span>
              </div>
              <h2 className="text-3xl font-bold mb-8">Cropping your PDF...</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
              <p className="text-gray-500 mb-10">Your cropped PDF is ready for download.</p>
              <div className="flex flex-col items-center gap-4">
                <a
                  href={downloadUrl!}
                  download="cropped.pdf"
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download Result
                </a>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFile(null);
                    setPdfDoc(null);
                    setCrop(initialCropState);
                    setDownloadUrl(null);
                  }}
                  className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">An error occurred</h2>
              <p className="text-gray-500 mb-8">{errorMessage || "We couldn't crop your PDF. Please try again."}</p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: ShieldCheck, title: "100% Private", desc: "Processing happens on our local server. No cloud APIs involved." },
              { icon: Zap, title: "Fast Engine", desc: "Powered by open-source libraries for lightning-fast results." },
              { icon: Cloud, title: "No Size Limits", desc: "Process files up to 100MB without any subscription." }
            ].map(({ icon: ItemIcon, ...item }, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-border-custom">
                <ItemIcon className="w-6 h-6 text-blue-600 mb-4" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="mt-20">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <span>You might also need</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Related tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relevantTools.map(({ icon: ToolIcon, ...tool }, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="bg-white p-6 rounded-3xl border border-border-custom hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer group block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div className={`${tool.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                    <ToolIcon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">{tool.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
                    <span>Use now</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
