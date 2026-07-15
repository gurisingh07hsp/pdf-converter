'use client';
import AdminSidebar from "@/components/admin/AdminSidebar";
import axios from "axios";
import { Search, Bell, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const fetchIsAdmin = async() => {
    try{
      const response = await axios.get('/api/auth/me', {withCredentials: true});
      if(response.status == 200){
        console.log('checking admin : ', response.data);
        if(response.data.user && response.data.user.role == 'admin'){
          setIsAdmin(true);
        }
        else{
          router.push('/login');
        }
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchIsAdmin();
  },[])

  if(!isAdmin){
    <div className="w-screen h-screen flex justify-center items-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="grow flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-border-custom flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-surface border border-border-custom px-4 py-2 rounded-xl w-96">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search jobs, users, or settings..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-gray-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl border border-border-custom text-gray-400 hover:bg-surface transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
            <button className="p-2.5 rounded-xl border border-border-custom text-gray-400 hover:bg-surface transition-all">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-border-custom mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Admin Dashboard</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v2.4.0-stable</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="grow p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
