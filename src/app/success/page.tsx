import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Download, RotateCcw, ArrowRight, Zap, Combine, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/success",
  },
}
export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          {/* Success Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-extrabold mb-4">Success! Your file is ready</h1>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Your processed document is available for download. We'll keep your file on our secure servers for the next 2 hours.
            </p>
          </div>

          {/* Download Card */}
          <div className="bg-white border border-border-custom rounded-3xl p-8 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center border border-border-custom">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-bold text-gray-400">PDF</span>
                   <CheckCircle2 className="w-6 h-6 text-primary mt-1" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">PDF Document</span>
                </div>
                <h3 className="text-xl font-bold">processed_document_v2.pdf</h3>
                <p className="text-xs text-gray-400 font-medium">2.4 MB • Optimized</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Download className="w-5 h-5" /> Download Now
              </button>
              <button className="text-gray-400 hover:text-foreground font-bold text-sm flex items-center gap-2 transition-colors">
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">What's next?</h2>
                <p className="text-gray-400 font-medium">Recommended tools for your document</p>
              </div>
              <Link href="/all-tools" className="text-blue-600 font-bold flex items-center gap-2 group">
                View all tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tool Card 1 */}
              <div className="bg-white border border-border-custom rounded-2xl p-8 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-10">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Compress PDF</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  Reduce file size while keeping best quality and compression.
                </p>
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                   Fast & Secure
                </div>
              </div>

              {/* Tool Card 2 */}
              <div className="bg-white border border-border-custom rounded-2xl p-8 hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-10">
                  <Combine className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Merge PDF</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
                  Combine multiple PDFs into one document in seconds.
                </p>
                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                   100% Free
                </div>
              </div>

              {/* Premium Promo */}
              <div className="bg-[#1a1a1a] rounded-2xl p-8 text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">Go Premium</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-12">
                    Batch process files and remove all size limits.
                  </p>
                  <button className="mt-auto bg-white text-black px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-between group-hover:bg-primary group-hover:text-white transition-all">
                    Upgrade Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Abstract graphic */}
                <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-white/5 skew-y-12 translate-y-1/2 translate-x-1/4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
