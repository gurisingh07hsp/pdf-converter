import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: "/pricing",
  },
}
const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for occasional tasks.",
    features: [
      { text: "Up to 10 files per day", included: true },
      { text: "Max 25MB file size", included: true },
      { text: "Batch processing", included: false },
      { text: "OCR Support", included: false },
    ],
    buttonText: "Current Plan",
    buttonClass: "bg-white text-gray-400 border border-border-custom",
    highlight: false
  },
  {
    name: "Pro",
    price: "$12",
    desc: "For professionals and power users.",
    features: [
      { text: "Unlimited daily files", included: true },
      { text: "Max 500MB file size", included: true },
      { text: "Batch processing (50 files)", included: true },
      { text: "Advanced OCR processing", included: true },
      { text: "No ads or watermarks", included: true },
    ],
    buttonText: "Upgrade to Pro",
    buttonClass: "bg-primary text-white shadow-xl shadow-primary/20",
    highlight: true,
    tag: "MOST POPULAR"
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Custom solutions for scaling teams.",
    features: [
      { text: "Unlimited everything", included: true },
      { text: "SSO & SAML Authentication", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom API integration", included: true },
    ],
    buttonText: "Contact Sales",
    buttonClass: "bg-[#1a1a1a] text-white",
    highlight: false
  }
];

const features = [
  { name: "Max File Size", free: "25 MB", pro: "500 MB", enterprise: "Unlimited" },
  { name: "Daily Tasks", free: "10", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Batch Processing", free: false, pro: true, enterprise: true },
  { name: "OCR Recognition", free: false, pro: true, enterprise: true },
  { name: "Password Protection", free: true, pro: true, enterprise: true },
  { name: "API Access", free: false, pro: false, enterprise: true },
  { name: "SSO / SAML", free: false, pro: false, enterprise: true },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        {/* Header */}
        <section className="px-8 pt-24 pb-16 text-center bg-white">
          <div className="max-w-4xl mx-auto">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">Pricing Plans</span>
            <h1 className="text-5xl font-extrabold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Whether you're an individual or a large corporation, we have a plan designed to streamline your document workflow.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="px-8 py-12 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative p-10 rounded-4xl border transition-all ${
                  plan.highlight 
                  ? "border-primary shadow-2xl shadow-primary/5 z-10 scale-105" 
                  : "border-border-custom bg-white"
                }`}
              >
                {plan.tag && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest whitespace-nowrap">
                    {plan.tag}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.desc}</p>
                </div>
                <div className="mb-10 flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-400 font-medium">/month</span>}
                </div>
                <div className="space-y-4 mb-12">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3">
                      {feat.included ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <X className="w-5 h-5 text-gray-200" />
                      )}
                      <span className={`text-sm ${feat.included ? "text-gray-600 font-medium" : "text-gray-300"}`}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] ${plan.buttonClass}`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="px-8 py-24 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Compare All Features</h2>
            <p className="text-gray-400 text-center mb-16 font-medium">Find the right fit for your document processing needs.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-custom">
                    <th className="py-6 font-bold text-sm">Features</th>
                    <th className="py-6 font-bold text-sm text-center w-1/4">Free</th>
                    <th className="py-6 font-bold text-sm text-center w-1/4 bg-surface rounded-t-2xl">Pro</th>
                    <th className="py-6 font-bold text-sm text-center w-1/4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom">
                  {features.map((feat, i) => (
                    <tr key={i} className="group">
                      <td className="py-6 text-sm text-gray-500 font-medium">{feat.name}</td>
                      <td className="py-6 text-sm font-bold text-center text-gray-400">{typeof feat.free === 'string' ? feat.free : (feat.free ? <Check className="w-4 h-4 mx-auto text-primary" /> : <X className="w-4 h-4 mx-auto text-red-400" />)}</td>
                      <td className="py-6 text-sm font-bold text-center bg-surface">{typeof feat.pro === 'string' ? feat.pro : (feat.pro ? <Check className="w-4 h-4 mx-auto text-primary" /> : <X className="w-4 h-4 mx-auto text-red-400" />)}</td>
                      <td className="py-6 text-sm font-bold text-center text-gray-600">{typeof feat.enterprise === 'string' ? feat.enterprise : (feat.enterprise ? <Check className="w-4 h-4 mx-auto text-primary" /> : <X className="w-4 h-4 mx-auto text-red-400" />)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-8 py-24 bg-surface">
          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-16 md:p-24 shadow-sm border border-border-custom">
            <h2 className="text-3xl font-bold mb-16">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              <div>
                <h3 className="text-lg font-bold mb-3">Can I cancel my subscription?</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Yes, you can cancel your Pro subscription at any time from your account settings without any cancellation fees.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">What file formats are supported?</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  We support PDF, DOCX, XLSX, JPG, PNG, TIFF, and many more. The Pro plan unlocks high-fidelity conversion for all types.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Is my data secure?</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Security is our priority. All files are encrypted using 256-bit SSL encryption and are automatically deleted after 2 hours.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Do you offer educational discounts?</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Absolutely! Students and teachers can receive a 50% discount on the Pro plan with a valid .edu email address.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
