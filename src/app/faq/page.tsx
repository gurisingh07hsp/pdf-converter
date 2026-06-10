import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Clock, Mail, MessageCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="px-8 pt-20 pb-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Support Center</span>
            <h1 className="text-5xl font-extrabold mb-6">How can we help you today?</h1>
            <p className="text-lg text-gray-500 max-w-2xl font-medium">
              Our team of PDF experts is standing by to assist with technical issues, enterprise licensing, or general inquiries about PDFSwift's high-speed conversion engine.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="px-8 py-12 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 bg-white border border-border-custom rounded-[2rem] p-12 shadow-sm">
              <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-surface border border-border-custom rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-surface border border-border-custom rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                  <select className="w-full bg-surface border border-border-custom rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all appearance-none">
                    <option>Select a topic...</option>
                    <option>Technical Support</option>
                    <option>Enterprise Licensing</option>
                    <option>Billing Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</label>
                  <textarea rows={6} placeholder="Describe your issue or inquiry in detail..." className="w-full bg-surface border border-border-custom rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all resize-none"></textarea>
                </div>
                <div className="flex items-center gap-6">
                  <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:shadow-xl transition-all">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-400 font-medium italic">Average response time: &lt; 2 hours</p>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Hours */}
              <div className="bg-surface border border-border-custom rounded-[2rem] p-10">
                <div className="flex items-center gap-3 mb-8">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Support Hours</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monday — Friday</span>
                    <span className="font-bold">08:00 – 20:00 EST</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Saturday</span>
                    <span className="font-bold">10:00 – 16:00 EST</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sunday</span>
                    <span className="text-gray-400 font-medium">Closed</span>
                  </div>
                </div>
              </div>

              {/* Direct Contact */}
              <div className="bg-white border border-border-custom rounded-[2rem] p-10">
                <div className="flex items-center gap-3 mb-8">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Direct Contact</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">General Support</div>
                    <a href="mailto:support@pdfswift.com" className="font-bold hover:text-primary transition-colors">support@pdfswift.com</a>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sales Inquiries</div>
                    <a href="mailto:sales@pdfswift.com" className="font-bold hover:text-primary transition-colors">sales@pdfswift.com</a>
                  </div>
                </div>
              </div>

              {/* Self Service */}
              <div className="bg-blue-600 rounded-[2rem] p-10 text-white relative overflow-hidden group cursor-pointer">
                <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-5 h-5" />
                  <h3 className="font-bold">Self-Service Help</h3>
                </div>
                <p className="text-sm text-blue-10/80 mb-8 leading-relaxed">
                  Browse our knowledge base for instant answers to common questions.
                </p>
                <button className="flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all">
                  Visit Help Center <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Trust */}
        <section className="px-8 py-20 bg-white">
          <div className="max-w-6xl mx-auto bg-surface border border-border-custom rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold mb-4">Enterprise Grade Security</h2>
              <p className="text-sm text-gray-500">All messages and file attachments sent through our support system are encrypted in transit and at rest. Your privacy and data security are our top priorities.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-gray-400 font-bold text-xs uppercase tracking-widest opacity-60">
              <span>ISO 27001</span>
              <span>GDPR</span>
              <span>SOC 2 Type II</span>
              <span>HIPAA</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
