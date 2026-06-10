"use client";

import { 
  Combine, 
  Split, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  FileEdit, 
  FileCheck, 
  LockKeyhole,
  FileSpreadsheet,
  Presentation,
  Globe,
  FileType2,
  Search,
  Sparkles,
  ArrowRight,
  Wrench
} from "lucide-react";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const staticTools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one document in seconds.",
    icon: Combine,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/merge",
    tags: ["combine", "join", "merge"]
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole set for easy management.",
    icon: Split,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    href: "/split",
    tags: ["separate", "extract", "pages"]
  },
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximum quality.",
    icon: Zap,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/compress",
    tags: ["reduce", "shrink", "size"]
  },
  {
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word files accurately.",
    icon: FileText,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/convert/pdf-to-word",
    tags: ["doc", "docx", "convert"]
  },
  {
    title: "PDF to JPG",
    description: "Extract all images or convert every page to high-res JPG.",
    icon: ImageIcon,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50",
    href: "/convert/pdf-to-jpg",
    tags: ["image", "png", "convert"]
  },
  {
    title: "Edit PDF",
    description: "Add text, shapes, comments and highlights with ease.",
    icon: FileEdit,
    iconColor: "text-red-400",
    bgColor: "bg-red-50",
    href: "/edit",
    tags: ["write", "modify", "annotate"]
  },
  {
    title: "Word to PDF",
    description: "Make DOC and DOCX files easy to read with PDF conversion.",
    icon: FileCheck,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/convert/word-to-pdf",
    tags: ["doc", "docx", "convert"]
  },
  {
    title: "Unlock PDF",
    description: "Remove password security from your protected files.",
    icon: LockKeyhole,
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50",
    href: "/unlock",
    tags: ["password", "security", "remove"]
  },
  {
    title: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF documents.",
    icon: Presentation,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/convert/powerpoint-to-pdf",
    tags: ["ppt", "pptx", "convert"]
  },
  {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF documents.",
    icon: FileSpreadsheet,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    href: "/convert/excel-to-pdf",
    tags: ["xls", "xlsx", "convert"]
  },
  {
    title: "HTML to PDF",
    description: "Convert web pages or HTML files to PDF documents.",
    icon: Globe,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    href: "/convert/html-to-pdf",
    tags: ["web", "url", "convert"]
  },
  {
    title: "PDF to PowerPoint",
    description: "Convert PDF documents to editable PowerPoint presentations.",
    icon: Presentation,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/convert/pdf-to-powerpoint",
    tags: ["ppt", "pptx", "convert"]
  },
  {
    title: "PDF to Excel",
    description: "Convert PDF documents to editable Excel spreadsheets.",
    icon: FileSpreadsheet,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    href: "/convert/pdf-to-excel",
    tags: ["xls", "xlsx", "convert"]
  },
  {
    title: "PDF to PDF/A",
    description: "Convert PDF documents to PDF/A for long-term archiving.",
    icon: FileType2,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/convert/pdf-to-pdfa",
    tags: ["archive", "long-term", "iso"]
  },
];

const popularSearches = [
  "Merge PDF",
  "Word to PDF",
  "Compress",
  "Split",
  "Edit PDF",
  "Unlock"
];

export default function ToolGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicTools, setDynamicTools] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/tools")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((t: any) => ({
          title: t.seo.metaTitle || t.slug,
          description: t.shortDescription,
          icon: Wrench,
          iconColor: "text-primary",
          bgColor: "bg-orange-50",
          href: `/tool/${t.slug}`,
          tags: t.seo.keywords?.split(",").map((k: string) => k.trim()) || []
        }));
        setDynamicTools(formatted);
      })
      .catch(err => console.error("Error fetching tools:", err));
  }, []);

  const allTools = useMemo(() => [...staticTools, ...dynamicTools], [dynamicTools]);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return allTools;
    const query = searchQuery.toLowerCase();
    return allTools.filter(tool => 
      tool.title.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, allTools]);

  return (
    <section className="bg-surface py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Modern Search Design */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Smart Search Enabled</span>
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4">What do you want to do today?</h2>
          </div>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-2xl border border-border-custom shadow-xl overflow-hidden">
              <div className="pl-6">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tools (e.g. 'merge', 'word', 'shrink')..."
                className="w-full px-6 py-6 text-lg font-medium text-foreground placeholder:text-gray-300 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="pr-6 text-xs font-bold text-gray-400 hover:text-foreground transition-colors"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Popular:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 rounded-xl bg-white border border-border-custom text-sm font-bold text-gray-500 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-foreground">
              {searchQuery ? `Search Results (${filteredTools.length})` : "All Powerful Tools"}
            </h2>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter">
                Filtering
              </span>
            )}
          </div>
          <span className="bg-white px-3 py-1 rounded border border-border-custom text-xs font-mono text-gray-400">
            V 2.4.0
          </span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <Link 
                key={index} 
                href={tool.href}
                className="bg-white p-6 rounded-2xl border border-border-custom hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer group block relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
                <div className={`${tool.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                  <tool.icon className={`w-7 h-7 ${tool.iconColor}`} />
                </div>
                <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-border-custom">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No tools found for "{searchQuery}"</h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">
              Try searching with different keywords or browse our all tools list above.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-8 text-primary font-bold text-sm hover:underline"
            >
              Show all tools
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
