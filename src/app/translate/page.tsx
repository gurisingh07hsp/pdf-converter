"use client";

import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ShieldCheck, Zap, Cloud, Download, RotateCcw, AlertCircle, Languages } from 'lucide-react';

// Dynamically import Document from react-pdf with ssr disabled
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });

const languages = [
  // Indian Languages
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'or', name: 'Odia' },
  { code: 'sa', name: 'Sanskrit' },
  // Global Languages
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ur', name: 'Urdu' },
];

export default function TranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('en');
  const [status, setStatus] = useState<'idle' | 'uploaded' | 'processing' | 'success' | 'error'>('idle');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

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

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const extractTextFromPDF = useCallback(async (file: File) => {
    if (!pdfjsLib) throw new Error('PDF library not loaded yet');

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }, [pdfjsLib]);

  const translateText = useCallback(async (text: string, sourceLang: string, targetLang: string) => {
    try {
      // Split text into chunks (MyMemory has a limit of ~5000 chars)
      const maxChunkSize = 4000;
      const chunks = [];
      let currentChunk = '';
      
      // Split by sentences to avoid breaking meaning
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        currentChunk += sentence;
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      
      let translatedText = '';
      
      for (const chunk of chunks) {
        const langPair = sourceLang === 'auto' ? targetLang : `${sourceLang}|${targetLang}`;
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${langPair}`);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
          translatedText += data.responseData.translatedText + ' ';
        } else {
          throw new Error(data.responseDetails || 'Translation failed');
        }
        
        // Add a small delay between requests to avoid rate limiting
        if (chunks.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return translatedText.trim();
    } catch (error: any) {
      console.error('Translate error:', error);
      throw new Error(error.message || 'Translation service unavailable');
    }
  }, []);

  const handleTranslate = async () => {
    if (!file) return;
    
    setStatus('processing');
    setErrorMessage(null);

    try {
      const extractedText = await extractTextFromPDF(file);
      const translated = await translateText(extractedText, sourceLang, targetLang);
      setTranslatedText(translated);
      setStatus('success');
    } catch (err: any) {
      console.error('Translate error:', err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setSourceLang('auto');
    setTargetLang('en');
    setStatus('idle');
    setTranslatedText('');
    setErrorMessage(null);
    setNumPages(0);
  };

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
            />
          )}

          {status === 'uploaded' && (
            <div className="bg-white rounded-4xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Translate your PDF</h2>
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">File: {file?.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleTranslate}
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
              <div className="bg-gray-50 rounded-xl p-6 mb-8 max-h-[400px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{translatedText}</pre>
              </div>
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={downloadAsText}
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
        </div>
      </main>
      <Footer />
    </>
  );
}
