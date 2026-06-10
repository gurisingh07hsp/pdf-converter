"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { ShieldCheck, Zap, Cloud, Download, RotateCcw, AlertCircle } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  apiEndpoint: string;
  acceptedTypes?: string[];
  multiple?: boolean;
}

export default function ToolLayout({ 
  title, 
  description, 
  apiEndpoint, 
  acceptedTypes = ['.pdf'],
  multiple = false 
}: ToolLayoutProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpload = async (files: File[]) => {
    setStatus('processing');
    setErrorMessage(null);
    setProgress(30);

    const formData = new FormData();
    if (multiple) {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('file', files[0]);
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Operation failed' }));
        throw new Error(errorData.error || 'Operation failed');
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/pdf')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        const data = await response.json();
        setDownloadUrl(data.downloadUrl);
      }
      
      setProgress(100);
      setStatus('success');
    } catch (err: any) {
      console.error('Tool error:', err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
            <p className="text-gray-500 font-medium">{description}</p>
          </div>

          {status === 'idle' && (
            <FileUpload 
              onUpload={handleUpload} 
              isProcessing={false} 
              acceptedTypes={acceptedTypes}
              multiple={multiple}
            />
          )}

          {status === 'processing' && (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">In Progress</span>
              </div>
              <h2 className="text-3xl font-bold mb-8">Processing your file...</h2>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-jakarta">Working...</span>
                  <span className="text-2xl font-black text-primary font-jakarta">{progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
              <p className="text-gray-500 mb-10">Your file is ready for download.</p>
              <div className="flex flex-col items-center gap-4">
                <a 
                  href={downloadUrl!} 
                  download
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download Result
                </a>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">An error occurred</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{errorMessage || "We couldn't process your request. Please try again."}</p>
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
    </div>
  );
}
