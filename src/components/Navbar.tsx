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
  Languages,
  RotateCw,
  List,
  Droplet,
  Crop,
  Menu,
  X
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

const organizePdf = [
  { title: "Merge PDF", href: "/merge", icon: Combine, color: "text-orange-500" },
  { title: "Split PDF", href: "/split", icon: Split, color: "text-red-500" },
  { title: "Remove Pages", href: "/remove-pages", icon: Trash2, color: "text-purple-500" },
]

const editPdf = [
  { title: "Rotate PDF", href: "/rotate-pdf", icon: RotateCw, color: "text-purple-600" },
  { title: "Add Page Numbers", href: "/add-page-numbers", icon: List, color: "text-purple-600" },
  { title: "Add Watermark", href: "/add-watermark", icon: Droplet, color: "text-purple-600" },
  { title: "PDF Editor", href: "/edit", icon: FileEdit, color: "text-red-400" },
  { title: "Crop PDF", href: "/crop-pdf", icon: Crop, color: "text-purple-600" },

]

const otherTools = [
  { title: "Compress PDF", href: "/compress", icon: Zap, color: "text-orange-600" },
  { title: "Unlock PDF", href: "/unlock", icon: LockKeyhole, color: "text-pink-500" },
  { title: "Translate PDF", href: "/translate", icon: Languages, color: "text-blue-500" },
];

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {user, logout} = useUser();

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border-custom bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center text-2xl font-bold leading-none">
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
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-foreground py-2 transition-colors leading-none">
              All Tools
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-220 bg-white border border-border-custom rounded-2xl shadow-2xl p-6 mt-0 flex gap-6">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Convert to PDF</div>
                  <div className="flex flex-col gap-1">
                    {convertToPdf.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{tool.title}</span>
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
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{tool.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Organize PDF</div>
                  <div className="flex flex-col gap-1">
                    {organizePdf.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{tool.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Edit PDF</div>
                  <div className="flex flex-col gap-1">
                    {editPdf.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{tool.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="w-56 border-l border-border-custom pl-6">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Other Tools</div>
                  <div className="flex flex-col gap-1">
                    {otherTools.map((tool, i) => (
                      <Link 
                        key={i} 
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{tool.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors leading-none">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors leading-none">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors leading-none">
            About
          </Link>
          <Link href="/faq" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors leading-none">
            FAQ
          </Link>
        </div>

        {!user ? (
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm cursor-pointer font-medium text-gray-700 hover:text-foreground leading-none">
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="bg-primary cursor-pointer text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm leading-none"
          >
            Sign Up
          </Link>
        </div>
        ) : (
          <button onClick={logout} className="hidden md:block bg-red-600 cursor-pointer text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm leading-none">
            Logout
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white mt-16 md:hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4 mb-6">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/pricing" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="/blog" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link 
                href="/faq" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
            </div>

            {/* All Tools for Mobile */}
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All Tools</div>
              
              <div className="mb-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Convert to PDF</div>
                <div className="flex flex-col gap-1">
                  {convertToPdf.map((tool, i) => (
                    <Link 
                      key={i} 
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all"
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center`}>
                        <tool.icon className={`w-3 h-3 ${tool.color}`} />
                      </div>
                      <div className="text-sm font-medium text-foreground">{tool.title}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Convert from PDF</div>
                <div className="flex flex-col gap-1">
                  {convertFromPdf.map((tool, i) => (
                    <Link 
                      key={i} 
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all"
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center`}>
                        <tool.icon className={`w-3 h-3 ${tool.color}`} />
                      </div>
                      <div className="text-sm font-medium text-foreground">{tool.title}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Organize PDF</div>
                <div className="flex flex-col gap-1">
                  {organizePdf.map((tool, i) => (
                    <Link 
                      key={i} 
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all"
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center`}>
                        <tool.icon className={`w-3 h-3 ${tool.color}`} />
                      </div>
                      <div className="text-sm font-medium text-foreground">{tool.title}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Edit PDF</div>
                <div className="flex flex-col gap-1">
                  {editPdf.map((tool, i) => (
                    <Link 
                      key={i} 
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all"
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center`}>
                        <tool.icon className={`w-3 h-3 ${tool.color}`} />
                      </div>
                      <div className="text-sm font-medium text-foreground">{tool.title}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Other Tools</div>
                <div className="flex flex-col gap-1">
                  {otherTools.map((tool, i) => (
                    <Link 
                      key={i} 
                      href={tool.href}
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-all"
                    >
                      <div className={`w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center`}>
                        <tool.icon className={`w-3 h-3 ${tool.color}`} />
                      </div>
                      <div className="text-sm font-medium text-foreground">{tool.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="p-4 border-t border-border-custom">
            {!user ? (
              <div className="flex gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex-1 text-center text-sm cursor-pointer font-medium text-gray-700 hover:text-foreground border border-gray-200 py-3 rounded-lg"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex-1 text-center bg-primary cursor-pointer text-white py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                className="w-full bg-red-600 cursor-pointer text-white py-3 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
