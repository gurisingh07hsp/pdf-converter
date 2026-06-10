import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const categories = ["All Articles", "Guides", "Productivity", "Security", "Updates"];

const posts = [
  {
    category: "PRODUCTIVITY",
    title: "10 PDF Hacks to Double Your Office Speed",
    desc: "From batch processing to automated OCR, discover the hidden features that save hours of manual work every week.",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    category: "GUIDES",
    title: "Mastering Format Conversions: PDF to Everything",
    desc: "A complete deep-dive into maintaining formatting and data integrity when switching between PDF, Word, and...",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    category: "SECURITY",
    title: "GDPR and PDFs: How to Ensure Total Compliance",
    desc: "Understanding your responsibilities when handling personal data within documents and how PDFSwift...",
    color: "text-red-500",
    bgColor: "bg-red-50"
  },
  {
    category: "PRODUCTIVITY",
    title: "Real-time Collaboration: Annotating PDFs as a Team",
    desc: "Say goodbye to email chains. Learn how to use PDFSwift's cloud features for seamless team feedback and...",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    category: "GUIDES",
    title: "Automation 101: Integrating PDFSwift API into Your App",
    desc: "A developer's roadmap to automating document generation and transformation using our robust REST API.",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    category: "SECURITY",
    title: "E-Signatures vs. Physical Signatures: What's Legal?",
    desc: "Demystifying the legality of digital signatures across different jurisdictions and industries for contract...",
    color: "text-red-500",
    bgColor: "bg-red-50"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="px-8 pt-20 pb-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-6">Resources & Insights</h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              Discover practical guides, security best practices, and productivity tips to streamline your document workflow with PDFSwift.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="px-8 py-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-border-custom rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              <div className="lg:w-1/2 aspect-[16/10] bg-gray-100 relative">
                <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">Featured</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-300 font-bold text-2xl italic">Guide Preview</span>
                </div>
              </div>
              <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Security</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">12 Min Read</span>
                </div>
                <h2 className="text-3xl font-bold mb-6 group-hover:text-primary transition-colors leading-tight">
                  The Ultimate Guide to PDF Security: Protecting Sensitive Data in 2024
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Learn how to implement military-grade encryption, redact sensitive information correctly, and manage document permissions like a pro.
                </p>
                <button className="text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Read the Full Guide <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="px-8 py-8 bg-white border-y border-border-custom sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat, i) => (
              <button 
                key={i}
                className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  i === 0 ? "bg-primary text-white" : "bg-white text-gray-400 border border-border-custom hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/10] bg-gray-100 rounded-2xl mb-8 overflow-hidden relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-200 font-bold italic">Image Preview</span>
                   </div>
                </div>
                <div className={`${post.bgColor} ${post.color} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-4`}>
                  {post.category}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                  {post.desc}
                </p>
                <button className="text-xs font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                  Read More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto mt-20 text-center">
            <button className="border border-border-custom px-8 py-3 rounded-lg font-bold text-sm inline-flex items-center gap-2 hover:bg-surface transition-all">
              Load More Articles <ExternalLink className="w-4 h-4" />
            </button>
            <p className="mt-4 text-xs text-gray-400 font-medium">Showing 6 of 42 articles</p>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto bg-primary rounded-[2.5rem] p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none" />
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Master Your Document Workflow</h2>
              <p className="text-white/80">Join 20,000+ professionals receiving weekly productivity tips and PDF security updates directly in their inbox.</p>
            </div>
            <div className="lg:w-1/2 w-full">
              <form className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow bg-white/10 border border-white/20 rounded-lg px-6 py-4 placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
                />
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:shadow-xl transition-all">Subscribe</button>
              </form>
              <p className="mt-4 text-xs text-white/60">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
