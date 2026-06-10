import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Zap, Cloud, X } from "lucide-react";

export default function ProcessingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 bg-surface">
        <div className="max-w-4xl w-full px-8">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-16 text-center relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">In Progress</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-2">Converting your PDF...</h1>
            <p className="text-gray-500 font-medium mb-12">
              Processing <span className="text-foreground font-bold">annual_report_2024.pdf</span> (4.2 MB)
            </p>

            {/* Animation Placeholder */}
            <div className="relative w-64 h-64 mx-auto mb-16">
              <div className="absolute inset-0 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                 <div className="w-40 h-52 bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
                    <div className="w-full h-4 bg-gray-50 rounded" />
                    <div className="w-3/4 h-4 bg-gray-50 rounded" />
                    <div className="flex-grow flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    </div>
                    <div className="w-full h-4 bg-gray-50 rounded" />
                 </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optimizing Assets...</span>
                <span className="text-2xl font-black text-primary">67%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '67%' }} />
              </div>
            </div>

            {/* Cancel Button */}
            <button className="border border-border-custom px-8 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition-all mb-8">
              <X className="w-4 h-4" /> Cancel Process
            </button>
            
            <p className="text-xs text-gray-400 font-medium italic">Don't close your browser. Almost there!</p>
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: ShieldCheck, title: "Secure SSL", desc: "Your files are encrypted and automatically deleted after conversion." },
              { icon: Zap, title: "Fast Engine", desc: "Proprietary compression logic ensures the smallest file size." },
              { icon: Cloud, title: "Cloud Native", desc: "Processed on high-performance nodes for zero latency." }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-border-custom">
                <item.icon className="w-6 h-6 text-blue-600 mb-4" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
