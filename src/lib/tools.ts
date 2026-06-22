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
  Trash2,
  Languages,
  RotateCw,
  List,
  Droplet,
  Crop,
  ShieldAlert,
  Shield,
  KeySquare,
  FileMinus2,
  Diff,
  ScanFace,
  Search,
  Wrench,
  Layers
} from "lucide-react";

export interface Tool {
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  href: string;
  tags: string[];
  category?: string | string[];
  slug?: string;
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
    keywords?: string;
  };
}

// Category-wise organized tools
export const toolCategories = {
  "ORGANIZE PDF": [
    "merge",
    "split",
    "remove-pages",
    "extract-pages",
    "organize-pdf",
    "scan-to-pdf"
  ],
  "OPTIMIZE PDF": [
    "compress",
    "repair",
    "ocr-pdf"
  ],
  "CONVERT TO PDF": [
    "jpg-to-pdf",
    "word-to-pdf",
    "powerpoint-to-pdf",
    "excel-to-pdf",
    "html-to-pdf"
  ],
  "CONVERT FROM PDF": [
    "pdf-to-jpg",
    "pdf-to-word",
    "pdf-to-powerpoint",
    "pdf-to-excel",
    "pdf-to-pdfa"
  ],
  "EDIT PDF": [
    "rotate-pdf",
    "add-page-numbers",
    "add-watermark",
    "crop-pdf",
    "edit",
    "pdf-forms"
  ],
  "PDF SECURITY": [
    "unlock",
    "protect",
    "sign",
    "redact",
    "compare"
  ],
  "PDF INTELLIGENCE": [
    "translate",
    "ai-summarizer"
  ]
};

export const tools: Tool[] = [
  // ORGANIZE PDF
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one document in seconds.",
    shortDescription: "Combine multiple PDFs into one document in seconds.",
    slug: "merge",
    icon: Combine,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/merge",
    tags: ["combine", "join", "merge"],
    category: ["ORGANIZE PDF", "pdf-manipulation"],
    seo: {
      metaTitle: "Merge PDF - Combine Multiple PDFs",
      metaDescription: "Combine multiple PDFs into one document in seconds."
    }
  },
  {
    title: "Split PDF",
    description: "Separate one page or a whole set for easy management.",
    shortDescription: "Separate one page or a whole set for easy management.",
    slug: "split",
    icon: Split,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    href: "/split",
    tags: ["separate", "extract", "pages"],
    category: ["ORGANIZE PDF", "pdf-manipulation", "pdf-pages"],
    seo: {
      metaTitle: "Split PDF - Extract Pages",
      metaDescription: "Separate one page or a whole set for easy management."
    }
  },
  {
    title: "Remove pages",
    description: "Select and remove specific pages from your PDF.",
    shortDescription: "Select and remove specific pages from your PDF.",
    slug: "remove-pages",
    icon: Trash2,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    href: "/remove-pages",
    tags: ["delete", "remove", "pages"],
    category: ["ORGANIZE PDF", "pdf-manipulation", "pdf-pages"],
    seo: {
      metaTitle: "Remove Pages from PDF - Delete Specific Pages",
      metaDescription: "Select and remove specific pages from your PDF."
    }
  },
  {
    title: "Extract pages",
    description: "Extract specific pages from your PDF.",
    shortDescription: "Extract specific pages from your PDF.",
    slug: "extract-pages",
    icon: FileMinus2,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/extract-pages",
    tags: ["extract", "pages"],
    category: ["ORGANIZE PDF", "pdf-manipulation", "pdf-pages"],
    seo: {
      metaTitle: "Extract Pages from PDF",
      metaDescription: "Extract specific pages from your PDF."
    }
  },
  {
    title: "Organize PDF",
    description: "Reorder pages in your PDF.",
    shortDescription: "Reorder pages in your PDF.",
    slug: "organize-pdf",
    icon: Layers,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/organize-pdf",
    tags: ["organize", "reorder", "pages"],
    category: ["ORGANIZE PDF", "pdf-manipulation"],
    seo: {
      metaTitle: "Organize PDF - Reorder Pages",
      metaDescription: "Reorder pages in your PDF."
    }
  },
  {
    title: "Scan to PDF",
    description: "Scan documents and convert to PDF.",
    shortDescription: "Scan documents and convert to PDF.",
    slug: "scan-to-pdf",
    icon: ScanFace,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
    href: "/scan-to-pdf",
    tags: ["scan", "pdf"],
    category: ["ORGANIZE PDF"],
    seo: {
      metaTitle: "Scan to PDF",
      metaDescription: "Scan documents and convert to PDF."
    }
  },

  // OPTIMIZE PDF
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximum quality.",
    shortDescription: "Reduce file size while optimizing for maximum quality.",
    slug: "compress",
    icon: Zap,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/compress",
    tags: ["reduce", "shrink", "size"],
    category: ["OPTIMIZE PDF", "pdf-optimize"],
    seo: {
      metaTitle: "Compress PDF - Reduce File Size",
      metaDescription: "Reduce file size while optimizing for maximum quality."
    }
  },
  {
    title: "Repair PDF",
    description: "Repair damaged or corrupted PDF files.",
    shortDescription: "Repair damaged or corrupted PDF files.",
    slug: "repair",
    icon: Wrench,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    href: "/repair",
    tags: ["repair", "fix", "corrupt"],
    category: ["OPTIMIZE PDF"],
    seo: {
      metaTitle: "Repair PDF - Fix Corrupted Files",
      metaDescription: "Repair damaged or corrupted PDF files."
    }
  },
  {
    title: "OCR PDF",
    description: "Make scanned PDFs searchable and editable with OCR.",
    shortDescription: "Make scanned PDFs searchable and editable with OCR.",
    slug: "ocr-pdf",
    icon: Search,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    href: "/ocr-pdf",
    tags: ["ocr", "searchable", "scan"],
    category: ["OPTIMIZE PDF"],
    seo: {
      metaTitle: "OCR PDF - Make PDFs Searchable",
      metaDescription: "Make scanned PDFs searchable and editable with OCR."
    }
  },

  // CONVERT TO PDF
  {
    title: "JPG to PDF",
    description: "Convert images (JPG, PNG) to PDF documents.",
    shortDescription: "Convert images (JPG, PNG) to PDF documents.",
    slug: "jpg-to-pdf",
    icon: ImageIcon,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50",
    href: "/convert/jpg-to-pdf",
    tags: ["jpg", "png", "convert", "image"],
    category: ["CONVERT TO PDF", "pdf-convert", "image-convert"],
    seo: {
      metaTitle: "JPG to PDF - Convert Images",
      metaDescription: "Convert images (JPG, PNG) to PDF documents."
    }
  },
  {
    title: "Word to PDF",
    description: "Make DOC and DOCX files easy to read with PDF conversion.",
    shortDescription: "Make DOC and DOCX files easy to read with PDF conversion.",
    slug: "word-to-pdf",
    icon: FileCheck,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/convert/word-to-pdf",
    tags: ["doc", "docx", "convert"],
    category: ["CONVERT TO PDF", "office-convert", "pdf-convert"],
    seo: {
      metaTitle: "Word to PDF - Convert DOC to PDF",
      metaDescription: "Make DOC and DOCX files easy to read with PDF conversion."
    }
  },
  {
    title: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF documents.",
    shortDescription: "Convert PowerPoint presentations to PDF documents.",
    slug: "powerpoint-to-pdf",
    icon: Presentation,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/convert/powerpoint-to-pdf",
    tags: ["ppt", "pptx", "convert"],
    category: ["CONVERT TO PDF", "office-convert", "pdf-convert"],
    seo: {
      metaTitle: "PowerPoint to PDF - Convert PPT to PDF",
      metaDescription: "Convert PowerPoint presentations to PDF documents."
    }
  },
  {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF documents.",
    shortDescription: "Convert Excel spreadsheets to PDF documents.",
    slug: "excel-to-pdf",
    icon: FileSpreadsheet,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    href: "/convert/excel-to-pdf",
    tags: ["xls", "xlsx", "convert"],
    category: ["CONVERT TO PDF", "office-convert", "pdf-convert"],
    seo: {
      metaTitle: "Excel to PDF - Convert Spreadsheets",
      metaDescription: "Convert Excel spreadsheets to PDF documents."
    }
  },
  {
    title: "HTML to PDF",
    description: "Convert web pages or HTML files to PDF documents.",
    shortDescription: "Convert web pages or HTML files to PDF documents.",
    slug: "html-to-pdf",
    icon: Globe,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    href: "/convert/html-to-pdf",
    tags: ["web", "url", "convert"],
    category: ["CONVERT TO PDF", "web-convert", "pdf-convert"],
    seo: {
      metaTitle: "HTML to PDF - Convert Web Pages",
      metaDescription: "Convert web pages or HTML files to PDF documents."
    }
  },

  // CONVERT FROM PDF
  {
    title: "PDF to JPG",
    description: "Extract all images or convert every page to high-res JPG.",
    shortDescription: "Extract all images or convert every page to high-res JPG.",
    slug: "pdf-to-jpg",
    icon: ImageIcon,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50",
    href: "/convert/pdf-to-jpg",
    tags: ["image", "png", "convert"],
    category: ["CONVERT FROM PDF", "pdf-convert", "image-convert"],
    seo: {
      metaTitle: "PDF to JPG - Convert Pages to Images",
      metaDescription: "Extract all images or convert every page to high-res JPG."
    }
  },
  {
    title: "PDF to Word",
    description: "Convert PDF documents to editable Word files accurately.",
    shortDescription: "Convert PDF documents to editable Word files accurately.",
    slug: "pdf-to-word",
    icon: FileText,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/convert/pdf-to-word",
    tags: ["doc", "docx", "convert"],
    category: ["CONVERT FROM PDF", "pdf-convert", "office-convert"],
    seo: {
      metaTitle: "PDF to Word - Convert to Editable DOCX",
      metaDescription: "Convert PDF documents to editable Word files accurately."
    }
  },
  {
    title: "PDF to PowerPoint",
    description: "Convert PDF documents to editable PowerPoint presentations.",
    shortDescription: "Convert PDF documents to editable PowerPoint presentations.",
    slug: "pdf-to-powerpoint",
    icon: Presentation,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    href: "/convert/pdf-to-powerpoint",
    tags: ["ppt", "pptx", "convert"],
    category: ["CONVERT FROM PDF", "pdf-convert", "office-convert"],
    seo: {
      metaTitle: "PDF to PowerPoint - Convert to PPTX",
      metaDescription: "Convert PDF documents to editable PowerPoint presentations."
    }
  },
  {
    title: "PDF to Excel",
    description: "Convert PDF documents to editable Excel spreadsheets.",
    shortDescription: "Convert PDF documents to editable Excel spreadsheets.",
    slug: "pdf-to-excel",
    icon: FileSpreadsheet,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    href: "/convert/pdf-to-excel",
    tags: ["xls", "xlsx", "convert"],
    category: ["CONVERT FROM PDF", "pdf-convert", "office-convert"],
    seo: {
      metaTitle: "PDF to Excel - Convert to Spreadsheets",
      metaDescription: "Convert PDF documents to editable Excel spreadsheets."
    }
  },
  {
    title: "PDF to PDF/A",
    description: "Convert PDF documents to PDF/A for long-term archiving.",
    shortDescription: "Convert PDF documents to PDF/A for long-term archiving.",
    slug: "pdf-to-pdfa",
    icon: FileType2,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/convert/pdf-to-pdfa",
    tags: ["archive", "long-term", "iso"],
    category: ["CONVERT FROM PDF", "pdf-optimize"],
    seo: {
      metaTitle: "PDF to PDF/A - Archive Your Documents",
      metaDescription: "Convert PDF documents to PDF/A for long-term archiving."
    }
  },

  // EDIT PDF
  {
    title: "Rotate PDF",
    description: "Rotate pages in your PDF document.",
    shortDescription: "Rotate pages in your PDF document.",
    slug: "rotate-pdf",
    icon: RotateCw,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/rotate-pdf",
    tags: ["rotate", "pages"],
    category: ["EDIT PDF", "pdf-edit"],
    seo: {
      metaTitle: "Rotate PDF - Rotate Pages",
      metaDescription: "Rotate pages in your PDF document."
    }
  },
  {
    title: "Add page numbers",
    description: "Add page numbers to your PDF document.",
    shortDescription: "Add page numbers to your PDF document.",
    slug: "add-page-numbers",
    icon: List,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/add-page-numbers",
    tags: ["page numbers", "number"],
    category: ["EDIT PDF", "pdf-edit"],
    seo: {
      metaTitle: "Add Page Numbers to PDF",
      metaDescription: "Add page numbers to your PDF document."
    }
  },
  {
    title: "Add watermark",
    description: "Add watermark to your PDF document.",
    shortDescription: "Add watermark to your PDF document.",
    slug: "add-watermark",
    icon: Droplet,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/add-watermark",
    tags: ["watermark", "stamp"],
    category: ["EDIT PDF", "pdf-edit"],
    seo: {
      metaTitle: "Add Watermark to PDF",
      metaDescription: "Add watermark to your PDF document."
    }
  },
  {
    title: "Crop PDF",
    description: "Crop pages in your PDF document.",
    shortDescription: "Crop pages in your PDF document.",
    slug: "crop-pdf",
    icon: Crop,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/crop-pdf",
    tags: ["crop", "pages"],
    category: ["EDIT PDF", "pdf-edit"],
    seo: {
      metaTitle: "Crop PDF - Crop Pages",
      metaDescription: "Crop pages in your PDF document."
    }
  },
  {
    title: "Edit PDF",
    description: "Add text, shapes, comments and highlights with ease.",
    shortDescription: "Add text, shapes, comments and highlights with ease.",
    slug: "edit",
    icon: FileEdit,
    iconColor: "text-red-400",
    bgColor: "bg-red-50",
    href: "/edit",
    tags: ["write", "modify", "annotate"],
    category: ["EDIT PDF", "pdf-edit"],
    seo: {
      metaTitle: "Edit PDF - Add Text & Comments",
      metaDescription: "Add text, shapes, comments and highlights with ease."
    }
  },
  {
    title: "PDF Forms",
    description: "Create and edit PDF forms.",
    shortDescription: "Create and edit PDF forms.",
    slug: "pdf-forms",
    icon: FileEdit,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    href: "/pdf-forms",
    tags: ["forms", "edit"],
    category: ["EDIT PDF"],
    seo: {
      metaTitle: "PDF Forms - Create & Edit",
      metaDescription: "Create and edit PDF forms."
    }
  },

  // PDF SECURITY
  {
    title: "Unlock PDF",
    description: "Remove password security from your protected files.",
    shortDescription: "Remove password security from your protected files.",
    slug: "unlock",
    icon: LockKeyhole,
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50",
    href: "/unlock",
    tags: ["password", "security", "remove"],
    category: ["PDF SECURITY", "pdf-security"],
    seo: {
      metaTitle: "Unlock PDF - Remove Password Protection",
      metaDescription: "Remove password security from your protected files."
    }
  },
  {
    title: "Protect PDF",
    description: "Add password protection to your PDF files.",
    shortDescription: "Add password protection to your PDF files.",
    slug: "protect",
    icon: Shield,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/protect",
    tags: ["password", "security", "protect"],
    category: ["PDF SECURITY"],
    seo: {
      metaTitle: "Protect PDF - Add Password",
      metaDescription: "Add password protection to your PDF files."
    }
  },
  {
    title: "Sign PDF",
    description: "Sign your PDF documents electronically.",
    shortDescription: "Sign your PDF documents electronically.",
    slug: "sign",
    icon: KeySquare,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/sign",
    tags: ["sign", "signature", "electronic"],
    category: ["PDF SECURITY"],
    seo: {
      metaTitle: "Sign PDF - Electronic Signatures",
      metaDescription: "Sign your PDF documents electronically."
    }
  },
  {
    title: "Redact PDF",
    description: "Redact sensitive information from your PDF files.",
    shortDescription: "Redact sensitive information from your PDF files.",
    slug: "redact",
    icon: ShieldAlert,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    href: "/redact",
    tags: ["redact", "sensitive", "information"],
    category: ["PDF SECURITY"],
    seo: {
      metaTitle: "Redact PDF - Remove Sensitive Info",
      metaDescription: "Redact sensitive information from your PDF files."
    }
  },
  {
    title: "Compare PDF",
    description: "Compare two PDF files to find differences.",
    shortDescription: "Compare two PDF files to find differences.",
    slug: "compare",
    icon: Diff,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/compare",
    tags: ["compare", "differences"],
    category: ["PDF SECURITY"],
    seo: {
      metaTitle: "Compare PDF - Find Differences",
      metaDescription: "Compare two PDF files to find differences."
    }
  },

  // PDF INTELLIGENCE
  {
    title: "Translate PDF",
    description: "Translate PDF text to another language, including Indian languages.",
    shortDescription: "Translate PDF text to another language, including Indian languages.",
    slug: "translate",
    icon: Languages,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    href: "/translate",
    tags: ["translate", "language", "convert"],
    category: ["PDF INTELLIGENCE", "pdf-translate"],
    seo: {
      metaTitle: "Translate PDF - Translate to Indian Languages",
      metaDescription: "Translate PDF text to another language, including Indian languages."
    }
  },
  {
    title: "AI Summarizer",
    description: "Summarize your PDF using AI.",
    shortDescription: "Summarize your PDF using AI.",
    slug: "ai-summarizer",
    icon: Languages,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50",
    href: "/ai-summarizer",
    tags: ["ai", "summarize", "summary"],
    category: ["PDF INTELLIGENCE"],
    seo: {
      metaTitle: "AI Summarizer - Summarize PDFs",
      metaDescription: "Summarize your PDF using AI."
    }
  }
];

export function getRelevantTools(currentToolHref: string, count: number = 4): Tool[] {
  const currentTool = tools.find(t => t.href === currentToolHref);
  if (!currentTool) return tools.slice(0, count);
  
  const currentCategories = Array.isArray(currentTool.category) ? currentTool.category : currentTool.category ? [currentTool.category] : [];
  
  return tools
    .filter(t => t.href !== currentToolHref)
    .map(t => {
      const tCategories = Array.isArray(t.category) ? t.category : t.category ? [t.category] : [];
      const hasMatchingCategory = tCategories.some(c => currentCategories.includes(c));
      const hasMatchingTag = t.tags.some(tag => currentTool.tags.includes(tag));
      return {
        ...t,
        score: hasMatchingCategory ? 2 : hasMatchingTag ? 1 : 0
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}
