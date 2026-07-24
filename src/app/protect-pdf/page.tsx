"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { ShieldCheck, Zap, Cloud, Download, RotateCcw, AlertCircle, ArrowRight, Lock, Unlock } from "lucide-react";
import Link from 'next/link';
import { getRelevantTools, Tool } from "@/lib/tools";

const ProtectPDF = () => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'uploaded' | 'processing' | 'success' | 'error'>('idle');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const relevantTools: Tool[] = getRelevantTools('/unlock');

    const handleFileSelect = async (files: File[]) => {
    setErrorMessage(null);
    const selectedFile = files[0];
    setFile(selectedFile);
    setStatus('uploaded');
    };

    const handleUnlock = async () => {
    if (!file) return;

    if(password !== confirmPassword){
        setErrorMessage("Password do not Match");
        return;
    }
    setStatus('processing');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
        const response = await fetch('/api/pdf/protect-pdf', {
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
        console.error('Unlock error:', err);
        setErrorMessage(err.message || 'Failed to unlock PDF. Make sure the password is correct.');
        setStatus('error');
    }
    };
  return (
  <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Protect PDF</h1>
            <p className="text-gray-500 font-medium">Protect your PDF files.</p>
          </div>

          {status === 'idle' && (
            <FileUpload 
              onUpload={handleFileSelect} 
              isProcessing={false} 
              acceptedTypes={['.pdf']}
              multiple={false}
              autoUpload={true}
            />
          )}

          {status === 'uploaded' && (
            <div className="bg-white rounded-4xl p-8 shadow-sm max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{file?.name}</p>
                  <p className="text-xs text-gray-500">{(file?.size || 0) / 1024 / 1024 < 1 ? `${Math.round((file?.size || 0) / 1024)} KB` : `${((file?.size || 0) / 1024 / 1024).toFixed(2)} MB`}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Password (if required)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border mt-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">Leave blank if the PDF is not password protected.</p>

                <p className='text-center mt-2 bg-red-100 rounded-2xl py-1 text-red-600'>{errorMessage}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUnlock}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all"
                >
                  <Unlock className="w-5 h-5" />
                  Unlock PDF
                </button>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFile(null);
                    setPassword('');
                  }}
                  className="px-6 py-4 text-gray-400 hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Choose Another File
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
              <h2 className="text-3xl font-bold mb-8">Unlocking your PDF...</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-4xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Success!</h2>
              <p className="text-gray-500 mb-10">Your unlocked PDF is ready for download.</p>
              <div className="flex flex-col items-center gap-4">
                <a
                  href={downloadUrl!}
                  download="unlocked.pdf"
                  className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" /> Download Result
                </a>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setFile(null);
                    setPassword('');
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
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{errorMessage || "We couldn't unlock your PDF. Please check the password and try again."}</p>
              <button
                onClick={() => setStatus('uploaded')}
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
  )
}

export default ProtectPDF
