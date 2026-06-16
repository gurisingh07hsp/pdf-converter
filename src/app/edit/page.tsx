"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import dynamic from 'next/dynamic';

const PDFEditor = dynamic(
  () => import('@/components/pdf-editor/PDFEditor'),
  { ssr: false }
);

export default function EditPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {!file && <Navbar />}
      <main className="grow bg-surface">
        {!file ? (
          <div className="max-w-4xl mx-auto px-8 py-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold mb-4">Edit PDF</h1>
              <p className="text-gray-500 font-medium">Add text, shapes, comments and highlights with ease locally.</p>
            </div>
            <FileUpload onUpload={(files) => setFile(files[0])} isProcessing={false} />
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "Freehand Draw", desc: "Use the pencil or marker to draw directly on your PDF pages." },
                 { title: "Text Overlays", desc: "Add notes, fill forms, or add comments anywhere on the document." },
                 { title: "Privacy First", desc: "All editing happens in your browser. No files are uploaded to our server for editing." }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-8 rounded-2xl border border-border-custom shadow-sm">
                   <h3 className="font-bold mb-3">{item.title}</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <PDFEditor file={file} />
        )}
      </main>
      {!file && <Footer />}
    </div>
  );
}
