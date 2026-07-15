"use client";

import { 
  Users, 
  Files, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const stats = [
  { 
    name: "Total Users", 
    value: "12,482", 
    change: "+12.5%", 
    trend: "up", 
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  { 
    name: "Files Processed", 
    value: "45,210", 
    change: "+18.2%", 
    trend: "up", 
    icon: Files,
    color: "text-primary",
    bgColor: "bg-orange-50"
  },
  { 
    name: "Active Jobs", 
    value: "142", 
    change: "-2.4%", 
    trend: "down", 
    icon: Activity,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  { 
    name: "Success Rate", 
    value: "99.92%", 
    change: "+0.02%", 
    trend: "up", 
    icon: CheckCircle2,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
];

const recentJobs = [
  { id: "JOB-9482", user: "m.chen@example.com", tool: "Compress PDF", status: "Completed", time: "2 mins ago", size: "14.2 MB" },
  { id: "JOB-9481", user: "s.jenkins@design.io", tool: "Merge PDF", status: "Processing", time: "4 mins ago", size: "8.1 MB" },
  { id: "JOB-9480", user: "e.rodriguez@corp.com", tool: "Word to PDF", status: "Completed", time: "12 mins ago", size: "2.4 MB" },
  { id: "JOB-9479", user: "anonymous_user", tool: "Split PDF", status: "Failed", time: "15 mins ago", size: "45.0 MB" },
  { id: "JOB-9478", user: "d.okafor@growth.io", tool: "Unlock PDF", status: "Completed", time: "18 mins ago", size: "1.2 MB" },
];

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-gray-400 font-medium">Monitor your PDF processing platform in real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-4xl border border-border-custom shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", stat.bgColor)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[2.5rem] border border-border-custom shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border-custom flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Recent Processing Jobs</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">Real-time update of PDF conversion tasks</p>
          </div>
          <button className="text-sm font-bold text-primary hover:underline">View all jobs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User / Email</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tool Used</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">File Size</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-surface transition-colors cursor-pointer group">
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{job.id}</td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{job.user}</td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-foreground bg-gray-50 px-3 py-1 rounded-full border border-border-custom">
                      {job.tool}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {job.status === "Completed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {job.status === "Processing" && <Clock className="w-4 h-4 text-blue-500 animate-spin" />}
                      {job.status === "Failed" && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <span className={cn(
                        "text-xs font-bold",
                        job.status === "Completed" && "text-green-600",
                        job.status === "Processing" && "text-blue-600",
                        job.status === "Failed" && "text-red-600"
                      )}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-400">{job.size}</td>
                  <td className="px-8 py-5 text-xs font-medium text-gray-400">{job.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
