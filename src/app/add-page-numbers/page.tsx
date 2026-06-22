"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ShieldCheck, Zap, Cloud, Download, RotateCcw, AlertCircle, ArrowRight, List } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { getRelevantTools, Tool } from '@/lib/tools';

// Dynamically import Document and Page with ssr disabled
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

export default function AddPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'uploaded' | 'processing' | 'success' | 'error'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [pageOptions, setPageOptions] = useState({
    position: 'bottom-right',
    margin: 20,
    startNumber: 1,
    fromPage: 1,
    toPage: 1,
  });
  const relevantTools: Tool[] = getRelevantTools('/add-page-numbers');

  // Set up pdfjs worker on client only
  useEffect(() => {
    import('react-pdf').then(async (mod) => {
      const { pdfjs } = mod;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });

    // Check screen size
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageOptions(prev => ({
      ...prev,
      toPage: numPages
    }));
  };

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setStatus('uploaded');
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;
    
    setStatus('processing');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageNumbersOptions', JSON.stringify(pageOptions));

    try {
      const response = await fetch('/api/pdf/add-page-numbers', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Operation failed' }));
        throw new Error(errorData.error || 'Operation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: any) {
      console.error('Add page numbers error:', err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setNumPages(0);
    setStatus('idle');
    setDownloadUrl(null);
    setErrorMessage(null);
    setPageOptions({
      position: 'bottom-right',
      margin: 20,
      startNumber: 1,
      fromPage: 1,
      toPage: 1,
    });
  };

  return (
    <>
      <Navbar />
      <main className="grow py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Add Page Numbers to PDF</h1>
            <p className="text-gray-500 font-medium">Add customizable page numbers to your PDF document.</p>
          </div>

          {status === 'idle' && (
            <FileUpload 
              onUpload={handleUpload} 
              isProcessing={false} 
              acceptedTypes={['.pdf']}
              multiple={false}
            />
          )}

          {status === 'uploaded' && (
            <div className="bg-white rounded-4xl p-4 md:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Page Thumbnails */}
                <div className="lg:w-2/3 w-full">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Preview PDF</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
                    {file && (
                      <Document 
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        {Array.from(new Array(numPages), (el, index) => (
                          <div 
                            key={index}
                            className="cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary transition-all flex flex-col items-center"
                          >
                            <div className="flex-1 flex items-center justify-center p-2">
                              <Page 
                                pageNumber={index + 1} 
                                scale={isSmallScreen ? 0.25 : 0.4} 
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                              />
                            </div>
                            <div className="p-2 text-center text-sm font-bold bg-white border-t border-gray-100 w-full">
                              Page {index + 1}
                            </div>
                          </div>
                        ))}
                      </Document>
                    )}
                  </div>
                </div>

                {/* Action Panel */}
                <div className="lg:w-1/3 w-full">
                  <div className="bg-gray-50 rounded-2xl p-6 sticky top-20">
                    <h3 className="font-bold text-lg mb-4">Page numbers options</h3>
                    
                    {/* Position */}
                    <div className="mb-4">
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Position</label>
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        {[
                          { value: 'top-left', label: 'TL' },
                          { value: 'top-center', label: 'TC' },
                          { value: 'top-right', label: 'TR' },
                          { value: 'left-center', label: 'LC' },
                          { value: 'center', label: 'C' },
                          { value: 'right-center', label: 'RC' },
                          { value: 'bottom-left', label: 'BL' },
                          { value: 'bottom-center', label: 'BC' },
                          { value: 'bottom-right', label: 'BR' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setPageOptions(prev => ({ ...prev, position: option.value }))}
                            className={`text-sm font-bold px-3 py-4 rounded-lg border-2 transition-all ${
                              pageOptions.position === option.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Margin */}
                    <div className="mb-4">
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Margin (px)</label>
                      <input
                        type="number"
                        min="0"
                        value={pageOptions.margin}
                        onChange={(e) => setPageOptions(prev => ({ ...prev, margin: parseInt(e.target.value) || 20 }))}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    {/* Start Number */}
                    <div className="mb-4">
                      <label className="text-sm font-bold text-gray-700 mb-2 block">First number</label>
                      <input
                        type="number"
                        min="1"
                        value={pageOptions.startNumber}
                        onChange={(e) => setPageOptions(prev => ({ ...prev, startNumber: parseInt(e.target.value) || 1 }))}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    {/* Pages Range */}
                    <div className="mb-4">
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Which pages do you want to number?</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          max={numPages}
                          value={pageOptions.fromPage}
                          onChange={(e) => setPageOptions(prev => ({ ...prev, fromPage: parseInt(e.target.value) || 1 }))}
                          className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="From page"
                        />
                        <input
                          type="number"
                          min={pageOptions.fromPage}
                          max={numPages}
                          value={pageOptions.toPage}
                          onChange={(e) => setPageOptions(prev => ({ ...prev, toPage: parseInt(e.target.value) || numPages }))}
                          className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm"
                          placeholder="To page"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={handleAddPageNumbers}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Add page numbers
                        <List className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={reset} className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" /> Start Over
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">In Progress</span>
              </div>
              <h2 className="text-3xl font-bold mb-8">Processing your file...</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
              <p className="text-gray-500 mb-10">Your file is ready for download.</p>
              <div className="flex flex-col items-center gap-4">
                <a 
                  href={downloadUrl!} 
                  download="with_page_numbers.pdf"
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download Result
                </a>
                <button 
                  onClick={reset}
                  className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">An error occurred</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{errorMessage || "We couldn't process your request. Please try again."}</p>
              <button 
                onClick={reset}
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
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-border-custom">
                <item.icon className="w-6 h-6 text-blue-600 mb-4" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-jakarta">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* How it Works */}
          <section className="mt-20">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <span>How it works</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">How to add page numbers to PDF</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Upload your PDF", description: "Select and upload your PDF file." },
                { title: "Customize page numbers", description: "Choose position, margin, and page range." },
                { title: "Download updated PDF", description: "Download your PDF with page numbers added." }
              ].map((step, index) => (
                <div key={index} className="bg-gray-50 rounded-3xl p-8">
                  <div className="text-primary font-black text-xl mb-4">Step {index + 1}</div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Relevant Tools */}
          <section className="mt-20">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <span>You might also need</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">Related tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relevantTools.map((tool, index) => (
                <Link 
                  key={index} 
                  href={tool.href}
                  className="bg-white p-6 rounded-3xl border border-border-custom hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer group block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div className={`${tool.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                    <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
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
    </>
  );
}
