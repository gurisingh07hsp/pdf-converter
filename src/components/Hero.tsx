import { FileUp, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-orange-100/50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <CheckCircle className="w-4 h-4" />
              Enterprise Document Engine
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
              Master Your Documents with <span className="text-primary">Absolute Precision.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 font-medium">
              Industrial-grade PDF tools designed for professionals who demand speed, security, and flawless formatting.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link 
                href="/" 
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                <FileUp className="w-5 h-5" />
                Upload Your PDF
              </Link>
              
              <Link 
                href="/" 
                className="inline-flex items-center gap-3 bg-white text-foreground border border-border-custom px-8 py-4 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
              >
                View All Tools
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <img 
                  src="https://i.pravatar.cc/40?img=1" 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img 
                  src="https://i.pravatar.cc/40?img=2" 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img 
                  src="https://i.pravatar.cc/40?img=3" 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
              <p className="text-sm font-medium text-gray-600">
                Trusted by 2M+ professionals worldwide
              </p>
            </div>
          </div>
          
          {/* Right image */}
          <div className="relative">
            <div className="relative">
              <div className="bg-white rounded-3xl border-8 border-white shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" 
                  alt="PDF Tools" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-border-custom flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Task Completed</p>
                  <p className="text-xs text-gray-500">Compression saved 84% space</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
