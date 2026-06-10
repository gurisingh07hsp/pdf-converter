import { ShieldCheck, Cloud, Monitor, CheckCircle, Zap, Database, Lock, Terminal } from "lucide-react";

export default function SecuritySection() {
  return (
    <section className="bg-white py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Illustration/Image */}
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[16/10] shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                <Monitor className="w-32 h-32 text-gray-300" />
              </div>
            </div>
            {/* Abstract floating elements could go here */}
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-6">
              <Zap className="w-3 h-3 fill-current" />
              Enterprise Ready
            </div>
            
            <h2 className="text-4xl font-bold text-foreground mb-8 leading-tight">
              Security and Speed as Standard.
            </h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">End-to-End Encryption</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Your files are processed with AES-256 encryption and deleted from our servers automatically after 2 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Cloud Processing</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Leverage our high-performance server clusters to process massive documents in seconds, not minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Monitor className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Cross-Platform Support</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Work seamlessly across Windows, Mac, Linux, and mobile browsers without installing any plugins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-24 pt-12 border-t border-border-custom grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] justify-center md:justify-start">
            <CheckCircle className="w-4 h-4" />
            GDPR Compliant
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] justify-center md:justify-start">
            <Zap className="w-4 h-4" />
            &lt; 1s Processing
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] justify-center md:justify-start">
            <Database className="w-4 h-4" />
            No Data Storage
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] justify-center md:justify-start">
            <Lock className="w-4 h-4" />
            ISO 27001
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] justify-center md:justify-start">
            <Terminal className="w-4 h-4" />
            Developer API
          </div>
        </div>
      </div>
    </section>
  );
}
