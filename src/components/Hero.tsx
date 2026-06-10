import { FileUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-4 py-16 md:py-24 bg-white">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
        Precision PDF Tools for <span className="text-primary">Fast Performance.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-500 max-w-2xl font-medium">
        Compress, convert, merge, and edit your documents with industrial-grade reliability. 
        No registration required for quick tasks.
      </p>

      <div className="mt-12 w-full max-w-3xl">
        <div className="border-2 border-dashed border-blue-600/30 rounded-2xl p-16 bg-white hover:border-blue-600/50 transition-all cursor-pointer group">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <FileUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Select PDF files</h3>
            <p className="mt-1 text-sm text-gray-400">or drop PDF here</p>
          </div>
        </div>
      </div>
    </section>
  );
}
