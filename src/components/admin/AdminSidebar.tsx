"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Files, 
  Settings, 
  Bell, 
  Search, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Newspaper,
  Globe,
  Wrench
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sidebarItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { name: "Tools", href: "/admin/tools", icon: Wrench },
  { name: "SEO Settings", href: "/admin/seo", icon: Globe },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Processing Jobs", href: "/admin/jobs", icon: Files },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-border-custom flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="p-6 border-b border-border-custom">
        <Link href="/" className="flex items-center text-xl font-bold">
          <Image src={'/logo.png'} alt="logo" width={130} height={50} />
          <span className="ml-2 px-2 py-0.5 bg-orange-50 text-primary text-[10px] rounded uppercase tracking-wider">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="grow p-4 space-y-2 mt-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-surface hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border-custom">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface mb-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div className="grow overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 font-medium">Super Admin</p>
          </div>
          <button className="text-gray-300 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest px-2">
          <ShieldCheck className="w-3 h-3" /> System Secure
        </div>
      </div>
    </aside>
  );
}
