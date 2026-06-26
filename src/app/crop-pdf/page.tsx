
"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { PDFDocument } from "pdf-lib";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import {
  ShieldCheck,
  Zap,
  Cloud,
  Download,
  RotateCcw,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getRelevantTools, Tool } from "@/lib/tools";

// Dynamically import react-pdf components with SSR disabled to prevent DOM errors
const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Import pdfjs and set worker only on client
let pdfjs: any;
if (typeof window !== "undefined") {
  import("react-pdf").then((mod) => {
    pdfjs = mod.pdfjs;
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

export default function CropPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploaded" | "processing" | "success" | "error"
  >("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1.2);
  const [cropAll, setCropAll] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startCrop, setStartCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const relevantTools: Tool[] = getRelevantTools("/crop-pdf");

  // Check if we're on the client
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(0.6);
      } else if (width < 1024) {
        setScale(0.9);
      } else {
        setScale(1.2);
      }
    };
    
    handleResize(); // Set initial scale
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileSelect = async (files: File[]) => {
    setErrorMessage(null);
    const selectedFile = files[0];
    setFile(selectedFile);
    setStatus("uploaded");
    setCurrentPage(1);
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageLoadSuccess = (page: any) => {
    const viewport = page.getViewport({ scale: scale });
    setPageSize({ width: viewport.width, height: viewport.height });
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const isInsideCropBox = (x: number, y: number) => {
    return (
      crop.width > 20 &&
      crop.height > 20 &&
      x >= crop.x &&
      x <= crop.x + crop.width &&
      y >= crop.y &&
      y <= crop.y + crop.height
    );
  };

  const isOnResizeHandle = (x: number, y: number) => {
    const handles = [
      { position: "top-left", check: (x: number, y: number) => Math.abs(x - crop.x) < 15 && Math.abs(y - crop.y) < 15 },
      { position: "top-right", check: (x: number, y: number) => Math.abs(x - (crop.x + crop.width)) < 15 && Math.abs(y - crop.y) < 15 },
      { position: "bottom-left", check: (x: number, y: number) => Math.abs(x - crop.x) < 15 && Math.abs(y - (crop.y + crop.height)) < 15 },
      { position: "bottom-right", check: (x: number, y: number) => Math.abs(x - (crop.x + crop.width)) < 15 && Math.abs(y - (crop.y + crop.height)) < 15 },
    ];
    for (const handle of handles) {
      if (handle.check(x, y)) return handle.position;
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { x, y } = getMousePosition(e);
    
    // Check if clicking a resize handle
    const handle = isOnResizeHandle(x, y);
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setStartPos({ x, y });
      setStartCrop({ ...crop });
      return;
    }

    // Check if clicking inside existing crop box
    if (isInsideCropBox(x, y)) {
      setIsDragging(true);
      setStartPos({ x, y });
      setStartCrop({ ...crop });
      return;
    }

    // Start new selection
    setIsDragging(true);
    setStartPos({ x, y });
    setStartCrop({ x, y, width: 0, height: 0 });
    setCrop({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    const { x, y } = getMousePosition(e);
    const dx = x - startPos.x;
    const dy = y - startPos.y;

    if (isResizing && resizeHandle) {
      let newX = startCrop.x;
      let newY = startCrop.y;
      let newWidth = startCrop.width;
      let newHeight = startCrop.height;

      switch (resizeHandle) {
        case "top-left":
          newX = Math.min(
            startCrop.x + startCrop.width - 20,
            Math.max(0, startCrop.x + dx)
          );
          newY = Math.min(
            startCrop.y + startCrop.height - 20,
            Math.max(0, startCrop.y + dy)
          );
          newWidth = startCrop.width - (newX - startCrop.x);
          newHeight = startCrop.height - (newY - startCrop.y);
          break;
        case "top-right":
          newY = Math.min(
            startCrop.y + startCrop.height - 20,
            Math.max(0, startCrop.y + dy)
          );
          newWidth = Math.max(
            20,
            Math.min(pageSize.width - startCrop.x, startCrop.width + dx)
          );
          newHeight = startCrop.height - (newY - startCrop.y);
          break;
        case "bottom-left":
          newX = Math.min(
            startCrop.x + startCrop.width - 20,
            Math.max(0, startCrop.x + dx)
          );
          newWidth = startCrop.width - (newX - startCrop.x);
          newHeight = Math.max(
            20,
            Math.min(pageSize.height - startCrop.y, startCrop.height + dy)
          );
          break;
        case "bottom-right":
          newWidth = Math.max(
            20,
            Math.min(pageSize.width - startCrop.x, startCrop.width + dx)
          );
          newHeight = Math.max(
            20,
            Math.min(pageSize.height - startCrop.y, startCrop.height + dy)
          );
          break;
      }
      setCrop({ x: newX, y: newY, width: newWidth, height: newHeight });
    } else if (isDragging) {
      // Check if new or existing selection
      if (startCrop.width === 0 && startCrop.height === 0) {
        // New selection
        const newX = Math.min(startCrop.x, x);
        const newY = Math.min(startCrop.y, y);
        const newWidth = Math.abs(x - startCrop.x);
        const newHeight = Math.abs(y - startCrop.y);
        setCrop({ x: newX, y: newY, width: newWidth, height: newHeight });
      } else {
        // Drag existing
        let newX = startCrop.x + dx;
        let newY = startCrop.y + dy;
        newX = Math.max(0, Math.min(pageSize.width - startCrop.width, newX));
        newY = Math.max(0, Math.min(pageSize.height - startCrop.height, newY));
        setCrop({ x: newX, y: newY, width: startCrop.width, height: startCrop.height });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleCrop = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocLib = await PDFDocument.load(arrayBuffer);

      if (cropAll) {
        const pages = pdfDocLib.getPages();
        pages.forEach((page) => {
          const originalWidth = page.getWidth();
          const originalHeight = page.getHeight();
          const pdfCropX = (crop.x / pageSize.width) * originalWidth;
          const pdfCropY =
            ((pageSize.height - crop.y - crop.height) / pageSize.height) *
            originalHeight;
          const pdfCropWidth = (crop.width / pageSize.width) * originalWidth;
          const pdfCropHeight = (crop.height / pageSize.height) * originalHeight;

          page.setCropBox(pdfCropX, pdfCropY, pdfCropWidth, pdfCropHeight);
          page.setMediaBox(pdfCropX, pdfCropY, pdfCropWidth, pdfCropHeight);
        });

        const pdfBytes = await pdfDocLib.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setStatus("success");
      } else {
        const newPdfDoc = await PDFDocument.create();
        const [copiedPage] = await newPdfDoc.copyPages(pdfDocLib, [
          currentPage - 1,
        ]);
        newPdfDoc.addPage(copiedPage);

        const page = newPdfDoc.getPages()[0];
        const originalWidth = page.getWidth();
        const originalHeight = page.getHeight();
        const pdfCropX = (crop.x / pageSize.width) * originalWidth;
        const pdfCropY =
          ((pageSize.height - crop.y - crop.height) / pageSize.height) *
          originalHeight;
        const pdfCropWidth = (crop.width / pageSize.width) * originalWidth;
        const pdfCropHeight = (crop.height / pageSize.height) * originalHeight;

        page.setCropBox(pdfCropX, pdfCropY, pdfCropWidth, pdfCropHeight);
        page.setMediaBox(pdfCropX, pdfCropY, pdfCropWidth, pdfCropHeight);

        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setStatus("success");
      }
    } catch (err: any) {
      console.error("Crop error:", err);
      setErrorMessage(err.message || "Failed to crop PDF");
      setStatus("error");
    }
  };

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow py-10 bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-2">Crop PDF</h1>
              <p className="text-gray-500 font-medium">
                Select the area to crop in your PDF document.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow py-10 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2">Crop PDF</h1>
            <p className="text-gray-500 font-medium">
              Select the area to crop in your PDF document.
            </p>
          </div>

          {status === "idle" && (
            <FileUpload
              onUpload={handleFileSelect}
              isProcessing={false}
              acceptedTypes={[".pdf"]}
              multiple={false}
            />
          )}

          {status === "uploaded" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* PDF Preview Area */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm">
                <div
                  ref={containerRef}
                  className="relative inline-block mx-auto cursor-crosshair max-w-full overflow-x-auto"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <Suspense fallback={<div className="w-full h-96 flex items-center justify-center">Loading PDF...</div>}>
                    <Document
                      file={file}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="flex justify-center"
                    >
                      <Page
                        pageNumber={currentPage}
                        scale={scale}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        onLoadSuccess={onPageLoadSuccess}
                      />
                    </Document>
                  </Suspense>

                  {/* Crop selection box */}
                  {crop.width > 0 && crop.height > 0 && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/10"
                      style={{
                        left: crop.x,
                        top: crop.y,
                        width: crop.width,
                        height: crop.height,
                        cursor: "move",
                      }}
                    >
                      {/* Resize handles */}
                      {crop.width > 20 && crop.height > 20 &&
                        [
                          {
                            position: "top-left",
                            cursor: "nwse-resize",
                            style: "top-0 left-0",
                          },
                          {
                            position: "top-right",
                            cursor: "nesw-resize",
                            style: "top-0 right-0",
                          },
                          {
                            position: "bottom-left",
                            cursor: "nesw-resize",
                            style: "bottom-0 left-0",
                          },
                          {
                            position: "bottom-right",
                            cursor: "nwse-resize",
                            style: "bottom-0 right-0",
                          },
                        ].map((handle) => (
                          <div
                            key={handle.position}
                            className={`absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md hover:scale-125 transition-transform z-10 ${handle.style}`}
                            style={{ cursor: handle.cursor }}
                          />
                        ))}
                    </div>
                  )}
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-100 rounded-full disabled:opacity-50 hover:bg-gray-200 transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline
                        points="15 18 9 12 15 6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span className="font-bold text-lg">
                    Page {currentPage} of {numPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(numPages, currentPage + 1))
                    }
                    disabled={currentPage === numPages}
                    className="p-2 bg-gray-100 rounded-full disabled:opacity-50 hover:bg-gray-200 transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline
                        points="9 18 15 12 9 6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Controls Sidebar */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Click and drag anywhere on the PDF to select the area you want to keep. Resize if needed.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-700">Pages:</h4>
                  <button
                    onClick={() => {
                      setCrop({ x: 0, y: 0, width: 0, height: 0 });
                    }}
                    className="text-red-500 text-sm font-bold hover:text-red-700 transition-colors"
                  >
                    Reset selection
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={cropAll}
                      onChange={() => setCropAll(true)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-gray-700">All pages</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!cropAll}
                      onChange={() => setCropAll(false)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-gray-700">Current page</span>
                  </label>
                </div>
                <button
                  onClick={handleCrop}
                  disabled={crop.width < 10 || crop.height < 10}
                  className="w-full bg-primary text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:scale-[1.01] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crop PDF
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="2"
                    />
                    <polyline
                      points="12 6 12 12 16 14"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFile(null);
                    setCrop({ x: 0, y: 0, width: 0, height: 0 });
                  }}
                  className="w-full text-gray-400 hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Choose Another File
                </button>
              </div>
            </div>
          )}

          {status === "processing" && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  In Progress
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-8">Cropping your PDF...</h2>
            </div>
          )}

          {status === "success" && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
              <p className="text-gray-500 mb-10">
                Your cropped PDF is ready for download.
              </p>
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
                    setStatus("idle");
                    setFile(null);
                    setCrop({ x: 0, y: 0, width: 0, height: 0 });
                    setDownloadUrl(null);
                  }}
                  className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">
                An error occurred
              </h2>
              <p className="text-gray-500 mb-8">
                {errorMessage || "We couldn't crop your PDF. Please try again."}
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: ShieldCheck,
                title: "100% Private",
                description:
                  "Processing happens on our local server. No cloud APIs involved.",
              },
              {
                icon: Zap,
                title: "Fast Engine",
                description:
                  "Powered by open-source libraries for lightning-fast results.",
              },
              {
                icon: Cloud,
                title: "No Size Limits",
                description:
                  "Process files up to 100MB without any subscription.",
              },
            ].map(({ icon: ItemIcon, ...item }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-border-custom"
              >
                <ItemIcon className="w-6 h-6 text-blue-600 mb-4" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
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
                  <div
                    className={`${tool.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}
                  >
                    <ToolIcon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    {tool.description}
                  </p>
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

