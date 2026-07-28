import Link from "next/link";
import { Globe, Share2 } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-4 md:px-8 border-t border-border-custom">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center text-xl font-bold">
            <Image src={'/logo.png'} alt="logo" width={130} height={50} />
          </Link>
          <p className="text-sm text-gray-400">
            © 2026 PDFSwift. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
          <Link href="/privacy" className="text-xs font-medium text-gray-500 hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs font-medium text-gray-500 hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/api" className="text-xs font-medium text-gray-500 hover:text-foreground">
            API Docs
          </Link>
          <Link href="/help" className="text-xs font-medium text-gray-500 hover:text-foreground">
            Help Center
          </Link>
          <Link href="/contact" className="text-xs font-medium text-gray-500 hover:text-foreground">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-foreground transition-colors border border-border-custom">
            <Globe className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-foreground transition-colors border border-border-custom">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
