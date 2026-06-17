"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left Side: Visual/Feature */}
      <div className="hidden lg:flex flex-1 bg-[#1a1a1a] items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent pointer-events-none" />
        <div className="max-w-md relative z-10">
          <Link href="/" className="flex items-center text-2xl font-bold mb-16">
            <span className="text-primary">PDF</span>
            <span className="text-white">Swift</span>
          </Link>

          <h2 className="text-4xl font-extrabold mb-8 leading-tight">Join the next generation of PDF productivity.</h2>
          
          <div className="space-y-8">
            {[
              { title: "No Cloud Leaks", desc: "Local processing ensures your sensitive data never leaves our secure server." },
              { title: "Enterprise Ready", desc: "Access high-performance tools used by Fortune 500 companies." },
              { title: "Smart Organization", desc: "Keep all your processed documents in one centralized, secure dashboard." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-gray-700" />
              ))}
            </div>
            <p className="text-sm text-gray-400 font-medium">Joined by <span className="text-white font-bold">20,000+</span> professionals this month.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-32 xl:px-48">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-12">
            <Link href="/" className="flex items-center text-2xl font-bold">
              <span className="text-primary">PDF</span>
              <span className="text-foreground">Swift</span>
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-foreground mb-4">Create your account</h1>
          <p className="text-gray-500 font-medium mb-10">Start your 14-day free trial of Pro features. No credit card required.</p>

          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full bg-surface border border-border-custom rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 rounded border-border-custom text-primary focus:ring-primary" />
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all">
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
