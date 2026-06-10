import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Clock, EyeOff, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const team = [
  {
    name: "Elena Rodriguez",
    role: "CEO & FOUNDER",
    bio: "Former infrastructure lead at major cloud providers. Elena drives the vision for a faster web.",
    image: "/team1.jpg", // Placeholder
  },
  {
    name: "Marcus Chen",
    role: "CTO",
    bio: "A veteran systems developer who architected our proprietary edge-processing engine.",
    image: "/team2.jpg",
  },
  {
    name: "Sarah Jenkins",
    role: "HEAD OF DESIGN",
    bio: "Sarah ensures that every tool in the PDFSwift suite is accessible and effortless for everyone.",
    image: "/team3.jpg",
  },
  {
    name: "David Okafor",
    role: "VP OF GROWTH",
    bio: "David connects our technology with the enterprises that need it most, ensuring scalability.",
    image: "/team4.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <span className="text-blue-600 font-mono text-xs font-bold tracking-widest uppercase mb-4 block">Our Mission</span>
            <h1 className="text-5xl font-extrabold text-foreground mb-8 max-w-3xl leading-tight">
              Fast, Secure, and Accessible PDF Tools for Everyone.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mb-12">
              At PDFSwift, we believe that high-performance document processing shouldn't be complicated or expensive. We're building the future of digital productivity through engineering excellence and a relentless focus on user privacy.
            </p>
            <div className="flex gap-4">
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold">Explore All Tools</button>
              <button className="bg-white text-foreground border border-border-custom px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" /> Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="px-8 py-24 bg-surface">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="aspect-[4/3] bg-gray-200 rounded-3xl overflow-hidden relative shadow-2xl">
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                  <span className="text-gray-400 font-bold">Office Preview</span>
               </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-500 leading-relaxed">
                <p>
                  Founded in 2022, PDFSwift began as a small internal tool developed by a group of engineers frustrated by the slow, cluttered, and often insecure online PDF editors available at the time.
                </p>
                <p>
                  We realized that while the world was moving toward remote work and digital-first documents, the tools we used to manage those documents were stuck in the past. We set out to create a platform that prioritizes speed without sacrificing the sophisticated features needed for professional workflows.
                </p>
                <p>
                  Today, PDFSwift serves over 2 million monthly users, providing a suite of over 30 specialized PDF utilities that operate entirely on high-performance edge servers, ensuring your files are processed in milliseconds.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-primary">2M+</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50M+</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Files Converted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment to Privacy */}
        <section className="px-8 py-24 bg-white text-center">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-500 mb-16">Your documents contain your most sensitive information. We handle them with the security they deserve.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "End-to-End Security", desc: "All file transfers are encrypted with 256-bit SSL/TLS. Your data is protected from the moment you hit upload until your download is complete." },
                { icon: Clock, title: "Auto-Deletion", desc: "Files are automatically and permanently deleted from our servers within 1 hour of processing. We never store, backup, or view your documents." },
                { icon: EyeOff, title: "Zero Data Harvesting", desc: "We don't sell your data to third parties. Our business model is built on transparency and utility, not on tracking our users." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl border border-border-custom text-left hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-8 py-24 bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
                <p className="text-gray-500">A global collective of engineers, designers, and document specialists working to streamline your digital life.</p>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold border border-border-custom bg-white px-6 py-2 rounded-lg">
                Join Our Team <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <div key={i} className="group">
                  <div className="aspect-square bg-gray-200 rounded-2xl mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">{member.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 py-24 bg-white">
          <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-[2rem] p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to work swifter?</h2>
            <p className="text-gray-400 mb-10 max-w-md mx-auto relative z-10">Join the millions of users who trust PDFSwift with their most important documents every day.</p>
            <div className="flex justify-center gap-4 relative z-10">
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold">Get Started for Free</button>
              <button className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all">View Enterprise Solutions</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
