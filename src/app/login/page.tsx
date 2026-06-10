"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-32 xl:px-48">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center text-2xl font-bold mb-12">
            <span className="text-primary">PDF</span>
            <span className="text-foreground">Swift</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-foreground mb-4">Welcome back</h1>
          <p className="text-gray-500 font-medium mb-10">Enter your credentials to access your account and files.</p>

          <div className="space-y-4 mb-8">
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-border-custom py-3.5 rounded-xl font-bold text-sm hover:bg-surface transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.082.818-.26.818-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.517-1.305.957-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              Sign in with GitHub
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-custom"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                className="w-full bg-surface border border-border-custom rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full bg-surface border border-border-custom rounded-xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
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

            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all">
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual/Feature */}
      <div className="hidden lg:flex flex-1 bg-surface items-center justify-center p-12 border-l border-border-custom">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-10">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-6 leading-tight">Secure & Private PDF Processing</h2>
          <p className="text-gray-500 leading-relaxed font-medium mb-12">
            Log in to manage your documents, access premium tools, and keep your files organized in our secure local processing cloud.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              "Unlimited Conversions",
              "Batch Processing",
              "Priority Support",
              "Custom Branding"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
