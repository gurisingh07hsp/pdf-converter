"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { 
  ChevronDown, 
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
  Trash2,
  Languages
} from "lucide-react";

const convertToPdf = [
  { title: "JPG to PDF", href: "/convert/jpg-to-pdf", icon: ImageIcon, color: "text-yellow-500" },
  { title: "Word to PDF", href: "/convert/word-to-pdf", icon: FileText, color: "text-blue-500" },
  { title: "PowerPoint to PDF", href: "/convert/powerpoint-to-pdf", icon: Presentation, color: "text-orange-500" },
  { title: "Excel to PDF", href: "/convert/excel-to-pdf", icon: FileSpreadsheet, color: "text-green-500" },
  { title: "HTML to PDF", href: "/convert/html-to-pdf", icon: Globe, color: "text-yellow-600" },
];

const convertFromPdf = [
  { title: "PDF to JPG", href: "/convert/pdf-to-jpg", icon: ImageIcon, color: "text-yellow-500" },
  { title: "PDF to Word", href: "/convert/pdf-to-word", icon: FileText, color: "text-blue-500" },
  { title: "PDF to PowerPoint", href: "/convert/pdf-to-powerpoint", icon: Presentation, color: "text-orange-500" },
  { title: "PDF to Excel", href: "/convert/pdf-to-excel", icon: FileSpreadsheet, color: "text-green-500" },
  { title: "PDF to PDF/A", href: "/convert/pdf-to-pdfa", icon: FileType2, color: "text-blue-600" },
];

const otherTools = [
  { title: "Merge PDF", href: "/merge", icon: Combine, color: "text-orange-500" },
  { title: "Split PDF", href: "/split", icon: Split, color: "text-red-500" },
  { title: "Compress PDF", href: "/compress", icon: Zap, color: "text-orange-600" },
  { title: "Remove Pages", href: "/remove-pages", icon: Trash2, color: "text-purple-500" },
  { title: "Translate PDF", href: "/translate", icon: Languages, color: "text-blue-500" },
  { title: "PDF Editor", href: "/edit", icon: FileEdit, color: "text-red-400" },
  { title: "Unlock PDF", href: "/unlock", icon: LockKeyhole, color: "text-pink-500" },
];

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {user, logout} = useUser();

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-border-custom bg-white sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center text-2xl font-bold">
          <span className="text-primary">PDF</span>
          <span className="text-foreground">Swift</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {/* All Tools Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-foreground py-2 transition-colors">
              All Tools
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-160 bg-white border border-border-custom rounded-2xl shadow-2xl p-8 mt-0 flex gap-8">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Convert to PDF</div>
                  <div className="flex flex-col gap-1">
                    {convertToPdf.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{tool.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Convert from PDF</div>
                  <div className="flex flex-col gap-1">
                    {convertFromPdf.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{tool.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="w-48 border-l border-border-custom pl-8">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Other Tools</div>
                  <div className="flex flex-col gap-1">
                    {otherTools.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-6 h-6 rounded bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-3 h-3 ${tool.color}`} />
                        </div>
                        <div className="text-[13px] font-medium text-foreground">{tool.title}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/faq" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
            FAQ
          </Link>
        </div>
      </div>

      {!user ? (
      <div className="flex items-center gap-6">
        <Link href="/login" className="text-sm cursor-pointer font-medium text-gray-700 hover:text-foreground">
          Log In
        </Link>
        <Link 
          href="/signup" 
          className="bg-primary cursor-pointer text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm"
        >
          Sign Up
        </Link>
      </div>
      ) : (
        <button onClick={logout} className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm">
          Logout
        </button>
      )}
    </nav>
  );
}
