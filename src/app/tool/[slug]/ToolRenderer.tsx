"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Wrench, ShieldCheck, Zap, Cloud } from "lucide-react";

interface ToolPageProps {
  tool: {
    slug?: string;
    category?: string | string[];
    shortDescription?: string;
    fullDescription?: string;
    engine?: {
      html: string;
      css: string;
      js: string;
    };
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
    };
  };
}

export default function ToolRenderer({ tool }: ToolPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !tool.slug || !tool.engine) return;

    // Inject CSS
    const styleId = `tool-style-${tool.slug}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = tool.engine.css;
      document.head.appendChild(style);
    }

    // Inject and Run JS
    const scriptId = `tool-script-${tool.slug}`;
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      // Wrap in a scoped function to avoid global namespace pollution
      script.textContent = `
        (function() {
          const container = document.getElementById('tool-container-${tool.slug}');
          ${tool.engine.js}
        })();
      `;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup
      const style = document.getElementById(styleId);
      if (style) style.remove();
      const script = document.getElementById(scriptId);
      if (script) script.remove();
    };
  }, [tool]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-12">
            {tool.category && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <Wrench className="w-3 h-3" />
                <span>{Array.isArray(tool.category) ? tool.category[0] : tool.category}</span>
              </div>
            )}
            <h1 className="text-4xl font-extrabold mb-4">{tool.seo?.metaTitle || tool.slug || "Tool"}</h1>
            {tool.shortDescription && (
              <p className="text-gray-500 font-medium max-w-2xl mx-auto">{tool.shortDescription}</p>
            )}
          </div>

          {/* Tool Container */}
          {tool.engine && tool.slug && (
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-border-custom mb-12">
              <div 
                id={`tool-container-${tool.slug}`}
                ref={containerRef}
                dangerouslySetInnerHTML={{ 
                  __html: tool.engine.html.replace('[CONTENT]', '<div id="tool-content-root"></div>') 
                }}
              />
            </div>
          )}

          {/* User Manual / Full Description */}
          {tool.fullDescription && (
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-border-custom shadow-sm mb-12 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                User Guide
              </h2>
              <div dangerouslySetInnerHTML={{ __html: tool.fullDescription }} />
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "100% Private", desc: "Your data never leaves your browser. All processing is local." },
              { icon: Zap, title: "Fast Engine", desc: "Optimized JavaScript execution for instant results." },
              { icon: Cloud, title: "No Install", desc: "No software required. Works directly in your web browser." }
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

function FileText({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
