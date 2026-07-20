// "use client";

// import { useState, useRef, useEffect, Suspense } from "react";
// import dynamic from "next/dynamic";
// import { PDFDocument } from "pdf-lib";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import FileUpload from "@/components/FileUpload";
// import {
//   ShieldCheck,
//   Zap,
//   Cloud,
//   Download,
//   RotateCcw,
//   AlertCircle,
//   ArrowRight,
//   RotateCw,
//   RotateCcw as RotateLeft,
// } from "lucide-react";
// import Link from "next/link";
// import { getRelevantTools, Tool } from "@/lib/tools";

// // Dynamically import react-pdf components with SSR disabled to prevent DOM errors
// const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
//   ssr: false,
// });
// const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
//   ssr: false,
// });

// // Import pdfjs and set worker only on client
// let pdfjs: any;
// if (typeof window !== "undefined") {
//   import("react-pdf").then((mod) => {
//     pdfjs = mod.pdfjs;
//     pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
//   });
// }

// export default function RotatePDFPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [status, setStatus] = useState<
//     "idle" | "uploaded" | "processing" | "success" | "error"
//   >("idle");
//   const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [numPages, setNumPages] = useState<number>(0);
//   const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
//   const [isClient, setIsClient] = useState(false);
//   const [scale, setScale] = useState(0.8);

//   const relevantTools: Tool[] = getRelevantTools("/rotate-pdf");

//   // Check if we're on the client
//   useEffect(() => {
//     setIsClient(true);
//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width < 640) {
//         setScale(0.5);
//       } else if (width < 1024) {
//         setScale(0.7);
//       } else {
//         setScale(0.8);
//       }
//     };

//     handleResize(); // Set initial scale
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleFileSelect = async (files: File[]) => {
//     setErrorMessage(null);
//     const selectedFile = files[0];
//     setFile(selectedFile);
//     setStatus("uploaded");
//     setPageRotations({}); // Reset rotations for new file
//   };

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//   };

//   const rotatePage = (pageNumber: number, degrees: 90 | -90) => {
//     setPageRotations(prev => {
//       const currentRotation = prev[pageNumber] || 0;
//       let newRotation: number;
//       if (degrees === 90) {
//         switch (currentRotation) {
//           case 0: newRotation = 90; break;
//           case 90: newRotation = 180; break;
//           case 180: newRotation = 270; break;
//           case 270: newRotation = 0; break;
//           default: newRotation = currentRotation;
//         }
//       } else {
//         switch (currentRotation) {
//           case 0: newRotation = 270; break;
//           case 90: newRotation = 0; break;
//           case 180: newRotation = 90; break;
//           case 270: newRotation = 180; break;
//           default: newRotation = currentRotation;
//         }
//       }
//       return { ...prev, [pageNumber]: newRotation };
//     });
//   };

//   const resetAllRotations = () => {
//     setPageRotations({});
//   };

//   const rotateAllRight = () => {
//     const newRotations: Record<number, number> = {};
//     for (let i = 1; i <= numPages; i++) {
//       const currentRotation = pageRotations[i] || 0;
//       let newRotation: number;
//       switch (currentRotation) {
//         case 0: newRotation = 90; break;
//         case 90: newRotation = 180; break;
//         case 180: newRotation = 270; break;
//         case 270: newRotation = 0; break;
//         default: newRotation = currentRotation;
//       }
//       newRotations[i] = newRotation;
//     }
//     setPageRotations(newRotations);
//   };

//   const rotateAllLeft = () => {
//     const newRotations: Record<number, number> = {};
//     for (let i = 1; i <= numPages; i++) {
//       const currentRotation = pageRotations[i] || 0;
//       let newRotation: number;
//       switch (currentRotation) {
//         case 0: newRotation = 270; break;
//         case 90: newRotation = 0; break;
//         case 180: newRotation = 90; break;
//         case 270: newRotation = 180; break;
//         default: newRotation = currentRotation;
//       }
//       newRotations[i] = newRotation;
//     }
//     setPageRotations(newRotations);
//   };

//   const handleRotate = async () => {
//     if (!file) return;
//     setStatus("processing");
//     setErrorMessage(null);
//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);
//       const pages = pdfDoc.getPages();

//       pages.forEach((page, index) => {
//         const pageNumber = index + 1;
//         const rotation = pageRotations[pageNumber] || 0;
//         if (rotation !== 0) {
//           // @ts-ignore: We know rotation is valid (0,90,180,270)
//           page.setRotation(rotation);
//         }
//       });

//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setDownloadUrl(url);
//       setStatus("success");
//     } catch (err: any) {
//       console.error("Rotate error:", err);
//       setErrorMessage(err.message || "Failed to rotate PDF");
//       setStatus("error");
//     }
//   };

//   if (!isClient) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="grow py-10 bg-surface">
//           <div className="max-w-7xl mx-auto px-4 md:px-8">
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-extrabold mb-2">Rotate PDF</h1>
//               <p className="text-gray-500 font-medium">
//                 Rotate individual pages or the entire PDF document.
//               </p>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="grow py-10 bg-surface">
//         <div className="max-w-7xl mx-auto px-4 md:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-extrabold mb-2">Rotate PDF</h1>
//             <p className="text-gray-500 font-medium">
//               Rotate individual pages or the entire PDF document.
//             </p>
//           </div>

//           {status === "idle" && (
//             <FileUpload
//               onUpload={handleFileSelect}
//               isProcessing={false}
//               acceptedTypes={[".pdf"]}
//               multiple={false}
//               autoUpload={true}
//             />
//           )}

//           {status === "uploaded" && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* PDF Preview Area */}
//               <div className="lg:col-span-2 bg-white rounded-3xl p-4 md:p-6 shadow-sm">
//                 <div className="lg:w-2/3 w-full">
//                   {/* <Suspense fallback={<div className="col-span-full h-96 flex items-center justify-center">Loading PDF...</div>}> */}
//                   <div className="p-2 max-h-[60vh] overflow-y-auto">
//                     <Document
//                       file={file}
//                       onLoadSuccess={onDocumentLoadSuccess}
//                       className="pdf-thumbnail-row"
//                     >
//                       {Array.from(new Array(numPages), (_, i) => (
//                         <div
//                           key={i + 1}
//                           className="relative group cursor-pointer overflow-hidden border-2 transition-all flex flex-col items-center"
//                         >
//                           <div
//                             className="flex-1 flex items-center justify-center p-2"
//                           >
//                             <Page
//                               pageNumber={i + 1}
//                               scale={scale}
//                               rotate={pageRotations[i + 1] || 0}
//                               renderAnnotationLayer={false}
//                               renderTextLayer={false}
//                               // className="rounded-xl"
//                             />
//                           </div>
//                           {/* Rotation Controls Hover */}
//                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 rounded-xl">
//                             <button
//                               onClick={() => rotatePage(i + 1, -90)}
//                               className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all"
//                               title="Rotate left"
//                             >
//                               <RotateLeft className="w-5 h-5 text-gray-800" />
//                             </button>
//                             <button
//                               onClick={() => rotatePage(i + 1, 90)}
//                               className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all"
//                               title="Rotate right"
//                             >
//                               <RotateCw className="w-5 h-5 text-gray-800" />
//                             </button>
//                           </div>
//                           <div className="text-center mt-2 text-sm font-medium text-gray-500">
//                             Page {i + 1}
//                           </div>
//                         </div>
//                       ))}
//                     </Document>
//                   {/* </Suspense> */}
//                   </div>
//                 </div>
//               </div>

//               {/* Controls Sidebar */}
//               <div className="space-y-4">
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <p className="text-sm text-blue-700">
//                     Mouse over PDF file below and a ↻ icon will appear, click on the arrows to rotate PDFs.
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-bold text-gray-700">Rotation</h4>
//                   <button
//                     onClick={resetAllRotations}
//                     className="text-red-500 text-sm font-bold hover:text-red-700 transition-colors"
//                   >
//                     Reset all
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   <button
//                     onClick={rotateAllRight}
//                     className="w-full flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
//                   >
//                     <div className="bg-primary p-2 rounded-lg text-white">
//                       <RotateCw className="w-5 h-5" />
//                     </div>
//                     <span className="font-medium text-gray-700">RIGHT</span>
//                   </button>
//                   <button
//                     onClick={rotateAllLeft}
//                     className="w-full flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
//                   >
//                     <div className="bg-primary p-2 rounded-lg text-white">
//                       <RotateLeft className="w-5 h-5" />
//                     </div>
//                     <span className="font-medium text-gray-700">LEFT</span>
//                   </button>
//                 </div>
//                 <button
//                   onClick={handleRotate}
//                   className="w-full bg-primary text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/30 hover:scale-[1.01] transition-all mt-4"
//                 >
//                   Rotate PDF
//                   <svg
//                     className="w-6 h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                   >
//                     <circle
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       strokeWidth="2"
//                     />
//                     <polyline
//                       points="12 6 12 12 16 14"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={() => {
//                     setStatus("idle");
//                     setFile(null);
//                     setPageRotations({});
//                   }}
//                   className="w-full text-gray-400 hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
//                 >
//                   <RotateCcw className="w-4 h-4" /> Choose Another File
//                 </button>
//               </div>
//             </div>
//           )}

//           {status === "processing" && (
//             <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
//               <div className="flex items-center justify-center gap-2 mb-4">
//                 <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                 <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
//                   In Progress
//                 </span>
//               </div>
//               <h2 className="text-3xl font-bold mb-8">Rotating your PDF...</h2>
//             </div>
//           )}

//           {status === "success" && (
//             <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
//               <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
//                 <ShieldCheck className="w-10 h-10 text-primary" />
//               </div>
//               <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
//               <p className="text-gray-500 mb-10">
//                 Your rotated PDF is ready for download.
//               </p>
//               <div className="flex flex-col items-center gap-4">
//                 <a
//                   href={downloadUrl!}
//                   download="rotated.pdf"
//                   className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
//                 >
//                   <Download className="w-5 h-5" /> Download Result
//                 </a>
//                 <button
//                   onClick={() => {
//                     setStatus("idle");
//                     setFile(null);
//                     setPageRotations({});
//                     setDownloadUrl(null);
//                   }}
//                   className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center gap-2 transition-colors"
//                 >
//                   <RotateCcw className="w-4 h-4" /> Start Over
//                 </button>
//               </div>
//             </div>
//           )}

//           {status === "error" && (
//             <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
//               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <AlertCircle className="w-8 h-8 text-red-500" />
//               </div>
//               <h2 className="text-2xl font-bold text-red-500 mb-4">
//                 An error occurred
//               </h2>
//               <p className="text-gray-500 mb-8">
//                 {errorMessage || "We couldn't rotate your PDF. Please try again."}
//               </p>
//               <button
//                 onClick={() => setStatus("idle")}
//                 className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
//             {[
//               {
//                 icon: ShieldCheck,
//                 title: "100% Private",
//                 description:
//                   "Processing happens on our local server. No cloud APIs involved.",
//               },
//               {
//                 icon: Zap,
//                 title: "Fast Engine",
//                 description:
//                   "Powered by open-source libraries for lightning-fast results.",
//               },
//               {
//                 icon: Cloud,
//                 title: "No Size Limits",
//                 description:
//                   "Process files up to 100MB without any subscription.",
//               },
//             ].map(({ icon: ItemIcon, ...item }, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl p-8 border border-border-custom"
//               >
//                 <ItemIcon className="w-6 h-6 text-blue-600 mb-4" />
//                 <h3 className="font-bold mb-2">{item.title}</h3>
//                 <p className="text-xs text-gray-500 leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <section className="mt-20">
//             <div className="mb-8">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
//                 <span>You might also need</span>
//               </div>
//               <h2 className="text-xl font-bold text-foreground">Related tools</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {relevantTools.map(({ icon: ToolIcon, ...tool }, index) => (
//                 <Link
//                   key={index}
//                   href={tool.href}
//                   className="bg-white p-6 rounded-3xl border border-border-custom hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer group block relative overflow-hidden"
//                 >
//                   <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <ArrowRight className="w-4 h-4 text-primary" />
//                   </div>
//                   <div
//                     className={`${tool.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}
//                   >
//                     <ToolIcon className={`w-7 h-7 ${tool.iconColor}`} />
//                   </div>
//                   <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors">
//                     {tool.title}
//                   </h3>
//                   <p className="text-sm text-gray-400 leading-relaxed font-medium">
//                     {tool.description}
//                   </p>
//                   <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all">
//                     <span>Use now</span>
//                     <ArrowRight className="w-3 h-3" />
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { PDFDocument, degrees } from "pdf-lib";
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
  RotateCw,
  RotateCcw as RotateLeft,
  Plus,
  ZoomIn,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { getRelevantTools, Tool } from "@/lib/tools";

const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
  ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

let pdfjs: any;
if (typeof window !== "undefined") {
  import("react-pdf").then((mod) => {
    pdfjs = mod.pdfjs;
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploaded" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);
  // const [scale, setScale] = useState(0.6);
  const [previewPage, setPreviewPage] = useState<number | null>(null);

  const relevantTools: Tool[] = getRelevantTools("/rotate-pdf");

  useEffect(() => {
    setIsClient(true);
    // const handleResize = () => {
    //   const width = window.innerWidth;
    //   if (width < 640) setScale(0.35);
    //   else if (width < 1024) setScale(0.45);
    //   else setScale(0.55);
    // };
    // handleResize();
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileSelect = async (files: File[]) => {
    setErrorMessage(null);
    const selectedFile = files[0];
    setFile(selectedFile);
    setStatus("uploaded");
    setPageRotations({});
    setDeletedPages(new Set());
    setSelectedPages(new Set());
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const nextRotation = (current: number, dir: 90 | -90) => {
    if (dir === 90) {
      switch (current) {
        case 0: return 90;
        case 90: return 180;
        case 180: return 270;
        default: return 0;
      }
    } else {
      switch (current) {
        case 0: return 270;
        case 90: return 0;
        case 180: return 90;
        default: return 180;
      }
    }
  };

  const rotatePage = (pageNumber: number, dir: 90 | -90) => {
    setPageRotations((prev) => ({
      ...prev,
      [pageNumber]: nextRotation(prev[pageNumber] || 0, dir),
    }));
  };

  const rotateAll = (dir: 90 | -90) => {
    setPageRotations((prev) => {
      const updated: Record<number, number> = { ...prev };
      for (let i = 1; i <= numPages; i++) {
        if (deletedPages.has(i)) continue;
        updated[i] = nextRotation(prev[i] || 0, dir);
      }
      return updated;
    });
  };

  const toggleSelectPage = (pageNumber: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  };

  const deletePage = (pageNumber: number) => {
    setDeletedPages((prev) => new Set(prev).add(pageNumber));
    setSelectedPages((prev) => {
      const next = new Set(prev);
      next.delete(pageNumber);
      return next;
    });
  };

  const deleteSelected = () => {
    setDeletedPages((prev) => {
      const next = new Set(prev);
      selectedPages.forEach((p) => next.add(p));
      return next;
    });
    setSelectedPages(new Set());
  };

  const resetAll = () => {
    setPageRotations({});
    setDeletedPages(new Set());
    setSelectedPages(new Set());
  };

  const activePageCount = numPages - deletedPages.size;

  const handleSaveAndDownload = async () => {
    if (!file) return;
    setStatus("processing");
    setErrorMessage(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Remove deleted pages first, from the end so indices stay valid
      const sortedDeleted = Array.from(deletedPages).sort((a, b) => b - a);
      sortedDeleted.forEach((pageNumber) => {
        pdfDoc.removePage(pageNumber - 1);
      });

      // Apply rotations, mapping original page numbers to remaining indices
      let offset = 0;
      for (let i = 1; i <= numPages; i++) {
        if (deletedPages.has(i)) continue;
        const rotation = pageRotations[i] || 0;
        if (rotation !== 0) {
          const page = pdfDoc.getPage(i - 1 - countDeletedBefore(i, deletedPages));
          page.setRotation(degrees(rotation));
        }
        offset++;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
    } catch (err: any) {
      console.error("Rotate error:", err);
      setErrorMessage(err.message || "Failed to rotate PDF");
      setStatus("error");
    }
  };

  function countDeletedBefore(pageNumber: number, deleted: Set<number>) {
    let count = 0;
    deleted.forEach((d) => {
      if (d < pageNumber) count++;
    });
    return count;
  }

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow py-10 bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-2">Rotate PDF pages</h1>
              <p className="text-gray-500 font-medium">
                Rotate your PDFs online for free. You can select one or multiple
                pages and rotate them at once!
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
            <h1 className="text-4xl font-extrabold mb-2">Rotate PDF pages</h1>
            <p className="text-gray-500 font-medium">
              Rotate your PDFs online for free. You can select one or multiple
              pages and rotate them at once!
            </p>
          </div>

          {status === "idle" && (
            <FileUpload
              onUpload={handleFileSelect}
              isProcessing={false}
              acceptedTypes={[".pdf"]}
              multiple={false}
              autoUpload={true}
            />
          )}

          {status === "uploaded" && (
            <div className="rounded-3xl overflow-hidden shadow-sm border border-border-custom">
              {/* Top toolbar */}
              <div className="bg-primary px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFile(null);
                    resetAll();
                  }}
                  className="bg-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm"
                  title="Choose another file"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => rotateAll(-90)}
                    className="bg-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <RotateLeft className="w-4 h-4" /> Rotate All
                  </button>
                  <button
                    onClick={() => rotateAll(90)}
                    className="bg-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <RotateCw className="w-4 h-4" /> Rotate All
                  </button>
                  <button
                    onClick={deleteSelected}
                    disabled={selectedPages.size === 0}
                    className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
                      selectedPages.size === 0
                        ? "bg-white/60 text-gray-400 cursor-not-allowed"
                        : "bg-white text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" /> Delete All
                  </button>
                </div>
              </div>

              {/* Page grid */}
              <div className="bg-white p-6 md:p-8 max-h-[65vh] overflow-y-auto">
  <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center">
      {Array.from(new Array(numPages), (_, i) => i + 1)
        .filter((pageNumber) => !deletedPages.has(pageNumber))
        .map((pageNumber) => {
          const isSelected = selectedPages.has(pageNumber);
          return (
            <div
              key={pageNumber}
              onClick={() => toggleSelectPage(pageNumber)}
              className={`relative group cursor-pointer rounded-2xl border-2 transition-all flex flex-col items-center bg-gray-50 w-full max-w-37.5 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="w-full h-47.5 flex items-center justify-center overflow-hidden p-2">
                <Page
                  pageNumber={pageNumber}
                  width={130}
                  rotate={pageRotations[pageNumber] || 0}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>

              {/* Hover controls */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPage(pageNumber);
                  }}
                  className="bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-all"
                  title="Preview"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rotatePage(pageNumber, -90);
                  }}
                  className="bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-all"
                  title="Rotate left"
                >
                  <RotateLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rotatePage(pageNumber, 90);
                  }}
                  className="bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-all"
                  title="Rotate right"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(pageNumber);
                  }}
                  className="bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-all"
                  title="Delete page"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Selection checkbox */}
              <div
                className={`absolute top-2 right-2 w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              <div className="text-center pb-2 text-xs font-semibold text-gray-500">
                {pageNumber}
              </div>
            </div>
          );
        })}
    </div>
  </Document>
</div>

              {/* Bottom bar */}
              <div className="bg-primary px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <span className="text-white font-bold text-sm">
                  {selectedPages.size} Selected
                </span>
                <button
                  onClick={handleSaveAndDownload}
                  disabled={activePageCount === 0}
                  className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save & Download
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
              <h2 className="text-3xl font-bold mb-8">Rotating your PDF...</h2>
            </div>
          )}

          {status === "success" && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
              <p className="text-gray-500 mb-10">
                Your rotated PDF is ready for download.
              </p>
              <div className="flex flex-col items-center gap-4">
                <a
                  href={downloadUrl!}
                  download="rotated.pdf"
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download Result
                </a>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFile(null);
                    resetAll();
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
                {errorMessage || "We couldn't rotate your PDF. Please try again."}
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Preview modal */}
          {previewPage !== null && (
            <div
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
              onClick={() => setPreviewPage(null)}
            >
              <div
                className="bg-white rounded-2xl p-4 max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewPage(null)}
                  className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <Document file={file}>
                  <Page
                    pageNumber={previewPage}
                    width={320}
                    rotate={pageRotations[previewPage] || 0}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              </div>
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
