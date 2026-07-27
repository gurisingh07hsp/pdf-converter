"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ShieldCheck, Zap, Cloud, Download, RotateCcw, AlertCircle, Languages, ArrowRight } from 'lucide-react';
import { getRelevantTools, Tool } from '@/lib/tools';
import { LanguageSelect } from '@/components/LanguageSelect';
import jsPDF from 'jspdf';
// Dynamically import Document from react-pdf with ssr disabled
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });

interface PdfPage {
  pageNumber: number;
  width: number;
  height: number;
  imageDataUrl: string;
  lines: TextLine[];
  text: string;
}

interface ExtractedPdf {
  numPages: number;
  pages: PdfPage[];
}

interface TextLine {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  translatedText: string;
}

interface PdfPage {
  pageNumber: number;
  width: number;
  height: number;
  imageDataUrl: string;
  lines: TextLine[];
  text: string;
}

type TextItem = {
    /**
     * - Text content.
     */
    str: string;
    /**
     * - Text direction: 'ttb', 'ltr' or 'rtl'.
     */
    dir: string;
    /**
     * - Transformation matrix.
     */
    transform: Array<any>;
    /**
     * - Width in device space.
     */
    width: number;
    /**
     * - Height in device space.
     */
    height: number;
    /**
     * - Font name used by PDF.js for converted font.
     */
    fontName: string;
    /**
     * - Indicating if the text content is followed by a
     * line-break.
     */
    hasEOL: boolean;
};


type Stage = 'idle' | 'extracting' | 'translating' | 'done' | 'error';


export default function TranslatePage() {
  const [status, setStatus] = useState<'idle' | 'uploaded' | 'processing' | 'success' | 'error'>('idle');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const relevantTools: Tool[] = getRelevantTools('/translate');
  const [downloading, setDownloading] = useState(false);


  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [completedPara, setCompletedPara] = useState(0);
  const [totalPara, setTotalPara] = useState(0);

  const [pages, setPages] = useState<PdfPage[]>([]);

  const abortRef = useRef<AbortController | null>(null);


  const handleTranslate = useCallback(async () => {
    if (!file) return;
    setError(null);
    setStatus('processing');
    setStage('extracting');
    setCurrentPage(0);
    setTotalPages(0);
    setCompletedPara(0);
    setTotalPara(0);
    setPages([]);

    abortRef.current = new AbortController();

    try {
      const extracted = await extractPdfText(file, (page, total) => {
        setCurrentPage(page);
        setTotalPages(total);
      });

      const allText: string[] = [];
      const refs: { pageIndex: number; lineIndex: number }[] = [];
      extracted.pages.forEach((p, pi) => {
        p.lines.forEach((line, li) => {
          allText.push(line.text);
          refs.push({ pageIndex: pi, lineIndex: li });
        });
      });

      setTotalPara(allText.length);
      setStage('translating');

      const translated = await translateBatch(
        allText,
        sourceLang,
        targetLang,
        (completed) => setCompletedPara(completed),
        abortRef.current.signal
      );

      console.log('translated : ', translated)

      const resultPages = extracted.pages.map((p) => ({ ...p, lines: [...p.lines] }));
      refs.forEach((ref, idx) => {
        resultPages[ref.pageIndex].lines[ref.lineIndex].translatedText = translated[idx];
      });
      console.log("result pages : ", resultPages);
      setPages(resultPages);
      setStage('done');
      setStatus('success');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setStage('error');
    }
  }, [file, sourceLang, targetLang]);

  // Set up pdfjs on client only
  useEffect(() => {
    import('react-pdf').then(mod => {
      const { pdfjs } = mod;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setStatus('uploaded');
    }
  };


  async function extractPdfText(
  file: File,
  onProgress?: (page: number, total: number) => void
): Promise<ExtractedPdf> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: buffer,
    useSystemFonts: true,
  cMapUrl: undefined,
    standardFontDataUrl: undefined,
  isEvalSupported: false,
  useWorkerFetch: false,
  disableFontFace: true,
  cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const pages: PdfPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    const renderScale = 2;
    const renderViewport = page.getViewport({ scale: renderScale });
    const canvas = document.createElement('canvas');
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
    }
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const content = await page.getTextContent();
    const rawItems = (content.items as TextItem[]).filter((it) => 'str' in it && it.str.length > 0);

    const lineMap = new Map<number, TextItem[]>();
    const yTolerance = 3;
    const sortedByY = [...rawItems].sort((a, b) => b.transform[5] - a.transform[5]);

    for (const item of sortedByY) {
      const y = item.transform[5];
      let placed = false;
      for (const keyY of lineMap.keys()) {
        if (Math.abs(y - keyY) <= yTolerance) {
          lineMap.get(keyY)!.push(item);
          placed = true;
          break;
        }
      }
      if (!placed) lineMap.set(y, [item]);
    }

    const lines: TextLine[] = [];
    for (const [, lineItems] of lineMap) {
      lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
      const text = lineItems.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
      if (!text) continue;

      const x = lineItems[0].transform[4];
      const lastItem = lineItems[lineItems.length - 1];
      const width = lastItem.transform[4] + lastItem.width - x;
      const y = lineItems[0].transform[5];
      const height = Math.max(...lineItems.map((it) => it.height || Math.abs(it.transform[3])));

      lines.push({ x, y, width, height, text, translatedText: '' });
    }

    lines.sort((a, b) => b.y - a.y);

    const pageText = lines.map((l) => l.text).join('\n');

    pages.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
      imageDataUrl,
      lines,
      text: pageText,
    });

    onProgress?.(i, pdf.numPages);
  }

  await pdf.cleanup();

  return { numPages: pdf.numPages, pages };
}

  async function translateBatch(
  texts: string[],
  source: string,
  target: string,
  onProgress?: (completed: number, total: number) => void,
  signal?: AbortSignal
): Promise<string[]> {
  const results: string[] = new Array(texts.length);
  const total = texts.length;
  let completed = 0;
  const BATCH = 6;

  for (let i = 0; i < total; i += BATCH) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const slice = texts.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      slice.map((t) => translateText(t, source, target))
    );

    settled.forEach((res, j) => {
      const idx = i + j;
      results[idx] = res.status === 'fulfilled' ? res.value?.translatedText : texts[idx];
      completed += 1;
      onProgress?.(completed, total);
    });
  }
  return results;
}


async function translateText(
  text: string,
  source: string,
  target: string
): Promise<{ translatedText: string; detectedSource?: string }> {
  try {
    if (!text || !target) {
      throw new Error("Missing required fields: q, target");
    }

    // Use Google Translate's free unofficial endpoint.
    // We split into batches to stay within URL length limits.
    const params = new URLSearchParams();
    params.set("client", "gtx");
    params.set("sl", source || "auto");
    params.set("tl", target);
    params.set("dt", "t");
    params.set("q", text);

    const url = `https://translate.googleapis.com/translate_a/single?${params.toString()}`;

    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!resp.ok) {
      throw new Error(`Translation service error (${resp.status})`);
    }

    const data = await resp.json();
    console.log("data : ", data);
    // data[0] is an array of [translatedChunk, originalChunk, ...] pairs
    let translatedText = "";
    if (Array.isArray(data) && Array.isArray(data[0])) {
      for (const chunk of data[0]) {
        if (Array.isArray(chunk) && typeof chunk[0] === "string") {
          translatedText += chunk[0];
        }
      }
    }

    if (!translatedText) {
      throw new Error("Translation response was empty");
    }

    // detected source language (if auto)
    let detectedSource: string | undefined;
    if (Array.isArray(data) && data[2]) {
      detectedSource = data[2] as string;
    }
    console.log('TranslatedText : ', translatedText);

    return { translatedText, detectedSource };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(message);
  }
}

const downloadAsText = () => {
  let content = "";
  const fileName = `${file?.name.replace(/\.pdf$/i, "")}_${targetLang}.txt`
  pages.forEach((page, pageIndex) => {
    content += `========== Page ${pageIndex + 1} ==========\n\n`;

    page.lines.forEach((line) => {
      if (line.translatedText) {
        content += line.translatedText + "\n";
      }
    });

    content += "\n";
  });

  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

    const reset = () => {
    abortRef.current?.abort();
    setFile(null);
    setStage('idle');
    setError(null);
    setPages([]);
    setCurrentPage(0);
    setTotalPages(0);
    setCompletedPara(0);
    setTotalPara(0);
  };

  const canTranslate = file && targetLang && stage !== 'extracting' && stage !== 'translating';

  return (
    <>
      <Navbar />
      <main className="grow py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Translate PDF</h1>
            <p className="text-gray-500 font-medium">Upload your PDF and translate it to any language, including major Indian languages.</p>
          </div>

          {status === 'idle' && (
            <FileUpload 
              onUpload={handleUpload} 
              isProcessing={false} 
              acceptedTypes={['.pdf']}
              multiple={false}
               autoUpload={true}
            />
          )}

          {status === 'uploaded' && (
            <div className="bg-white rounded-4xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Translate your PDF</h2>
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">File: {file?.name}</p>
              </div>

                <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Translation
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <LanguageSelect
                    label="From"
                    value={sourceLang}
                    onChange={setSourceLang}
                    id="source-lang"
                    allowAuto
                  />
                  <div className="flex shrink-0 items-center justify-center pb-3 sm:pb-3.5">
                    <ArrowRight className="h-5 w-5 text-slate-300 rotate-90 sm:rotate-0" />
                  </div>
                  <LanguageSelect
                    label="To"
                    value={targetLang}
                    onChange={setTargetLang}
                    id="target-lang"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Leave &quot;From&quot; as Auto-detect to let the translator detect the source language.
                </p>
              </div>

              {error && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-fade-in-fast">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-medium">Translation failed</p>
                    <p className="mt-0.5 text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Source Language</label>
                  <select 
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    <option value="auto">Auto Detect</option>
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Language</label>
                  <select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div> */}

              <div className="flex gap-3">
                <button 
                  onClick={handleTranslate}
                  disabled={!canTranslate}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  Translate
                  <Languages className="w-5 h-5" />
                </button>
                <button 
                  onClick={reset}
                  className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">In Progress</span>
              </div>
              <h2 className="text-3xl font-bold mb-8">Translating your file...</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-4xl p-8 shadow-sm">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4 text-center">Translation Complete!</h2>
              {/* <div className="bg-gray-50 rounded-xl p-6 mb-8 max-h-100 overflow-y-auto">
                <pre className="text-sm text-black whitespace-pre-wrap">{translatedText}</pre>
              </div> */}
              <div className="flex mt-2 flex-col items-center gap-4">
                <button 
                  onClick={downloadAsText}
                  disabled={downloading}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download as TXT
                </button>
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
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{errorMessage || "We couldn't translate your file. Please try again."}</p>
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
              { icon: ShieldCheck, title: "100% Private", desc: "All processing happens in your browser. Your file never leaves your device." },
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
              <h2 className="text-xl font-bold text-foreground">How to translate PDF</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Upload your PDF", description: "Select and upload your PDF file." },
                { title: "Choose languages", description: "Select source (auto-detect works well!) and target languages." },
                { title: "Download translation", description: "Download your translated text as a TXT file." }
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
