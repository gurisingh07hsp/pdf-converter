"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Code2, 
  Settings, 
  Globe, 
  Image as ImageIcon,
  ChevronDown,
  Layout,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Eraser,
  Wrench
} from "lucide-react";

interface Tool {
  id: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  engine: {
    html: string;
    css: string;
    js: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  createdAt: string;
}

const CATEGORIES = ["Uncategorized", "PDF Tools", "Image Tools", "Calculators", "Converters", "Security"];

export default function ToolManagement() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [activeEngineTab, setActiveEngineTab] = useState<"html" | "css" | "js">("html");
  const [currentTool, setCurrentTool] = useState<Partial<Tool>>({
    slug: "",
    category: "Uncategorized",
    shortDescription: "",
    fullDescription: "",
    engine: { html: "<!-- Your HTML code here -->", css: "", js: "" },
    seo: { metaTitle: "", metaDescription: "", keywords: "" }
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const res = await fetch("/api/admin/tools");
    const data = await res.json();
    setTools(data);
  };

  const handleSave = async () => {
    const res = await fetch("/api/admin/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentTool),
    });
    if (res.ok) {
      setIsEditing(false);
      resetForm();
      fetchTools();
    }
  };

  const resetForm = () => {
    setCurrentTool({
      slug: "",
      category: "Uncategorized",
      shortDescription: "",
      fullDescription: "",
      engine: { html: "<!-- Your HTML code here -->", css: "", js: "" },
      seo: { metaTitle: "", metaDescription: "", keywords: "" }
    });
  };

  const handleEdit = (tool: Tool) => {
    setCurrentTool(tool);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;
    const res = await fetch("/api/admin/tools", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchTools();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tool Management</h1>
          <p className="text-sm text-gray-400 font-medium">Add and manage your interactive tools</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add New Tool
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-[2rem] border border-border-custom shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-8 border-b border-border-custom bg-gray-50/50">
            <h2 className="text-lg font-bold text-foreground">{currentTool.id ? "Edit Tool" : "Add New Tool"}</h2>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Slug & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Slug *</label>
                <input 
                  type="text" 
                  value={currentTool.slug}
                  onChange={(e) => setCurrentTool({ ...currentTool, slug: e.target.value })}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="json-formatter"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                <div className="relative">
                  <select 
                    value={currentTool.category}
                    onChange={(e) => setCurrentTool({ ...currentTool, category: e.target.value })}
                    className="w-full bg-white border border-border-custom pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Short Description</label>
              <textarea 
                rows={3}
                value={currentTool.shortDescription}
                onChange={(e) => setCurrentTool({ ...currentTool, shortDescription: e.target.value })}
                className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Brief summary for tool cards and archives..."
              />
              <p className="text-[10px] text-gray-300 font-medium px-1 italic">Displayed in tool cards and archive pages</p>
            </div>

            {/* Full Description (WYSIWYG) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Full Description (User Manual)</label>
                <div className="flex bg-surface p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab("visual")}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${activeTab === "visual" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-foreground"}`}
                  >
                    Visual
                  </button>
                  <button 
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${activeTab === "code" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-foreground"}`}
                  >
                    Code
                  </button>
                </div>
              </div>
              
              <div className="border border-border-custom rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-surface p-2 border-b border-border-custom flex flex-wrap gap-1">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-custom bg-white text-[11px] font-bold text-foreground hover:bg-gray-50">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" /> Add Media
                  </button>
                  <div className="w-px h-6 bg-border-custom mx-1 self-center" />
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-custom bg-white text-[11px] font-bold text-foreground hover:bg-gray-50">
                    Paragraph <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="w-px h-6 bg-border-custom mx-1 self-center" />
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><Bold className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><Italic className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><Underline className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><List className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><LinkIcon className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><Type className="w-4 h-4" /></button>
                  <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"><Eraser className="w-4 h-4" /></button>
                </div>
                <textarea 
                  rows={10}
                  value={currentTool.fullDescription}
                  onChange={(e) => setCurrentTool({ ...currentTool, fullDescription: e.target.value })}
                  className={`w-full bg-white px-6 py-4 text-sm focus:outline-none resize-none min-h-[250px] ${activeTab === "code" ? "font-mono bg-gray-900 text-green-400" : ""}`}
                  placeholder={activeTab === "visual" ? "Write the user manual here..." : "<!-- HTML code for description -->"}
                />
              </div>
            </div>

            {/* Tool Engine (Code) */}
            <div className="bg-white rounded-2xl border border-border-custom overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border-custom flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Tool Engine (Code)</h3>
                    <p className="text-[10px] text-gray-400 font-medium">HTML/CSS/JavaScript for your tool</p>
                  </div>
                </div>
                <div className="flex bg-surface p-1 rounded-lg">
                  {["html", "css", "js"].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveEngineTab(tab as any)}
                      className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all ${activeEngineTab === tab ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-foreground"}`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest z-10 pointer-events-none opacity-50">
                  <Settings className="w-3 h-3" /> Use <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">[CONTENT]</span> placeholder for dynamic content injection if needed.
                </div>
                <textarea 
                  rows={15}
                  value={currentTool.engine?.[activeEngineTab]}
                  onChange={(e) => setCurrentTool({ 
                    ...currentTool, 
                    engine: { ...currentTool.engine!, [activeEngineTab]: e.target.value } 
                  })}
                  className="w-full bg-[#1e1e1e] text-gray-300 p-8 pt-14 text-sm font-mono focus:outline-none resize-none min-h-[400px]"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* SEO Settings */}
            <div className="pt-8 border-t border-border-custom space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="w-5 h-5" />
                <h3 className="text-base font-bold text-foreground">SEO Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Meta Title</label>
                  <input 
                    type="text" 
                    value={currentTool.seo?.metaTitle}
                    onChange={(e) => setCurrentTool({ ...currentTool, seo: { ...currentTool.seo!, metaTitle: e.target.value }})}
                    className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Focus Keywords</label>
                  <input 
                    type="text" 
                    value={currentTool.seo?.keywords}
                    onChange={(e) => setCurrentTool({ ...currentTool, seo: { ...currentTool.seo!, keywords: e.target.value }})}
                    className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. json formatter, beautify json"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Meta Description</label>
                <textarea 
                  rows={3}
                  value={currentTool.seo?.metaDescription}
                  onChange={(e) => setCurrentTool({ ...currentTool, seo: { ...currentTool.seo!, metaDescription: e.target.value }})}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Brief description for search engine results..."
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 border-t border-border-custom flex gap-3">
            <button 
              onClick={handleSave}
              className="bg-primary text-white px-10 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              {currentTool.id ? "Update Tool" : "Create Tool"}
            </button>
            <button 
              onClick={() => { setIsEditing(false); resetForm(); }}
              className="bg-[#4b5563] text-white px-10 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:opacity-90 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tool List */}
      {!isEditing && (
        <div className="grid grid-cols-1 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white p-6 rounded-[1.5rem] border border-border-custom shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-gray-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter rounded">
                      {tool.category}
                    </span>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{tool.slug}</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-medium truncate max-w-md">{tool.shortDescription}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(tool)}
                  className="p-2.5 rounded-xl text-gray-400 hover:bg-surface hover:text-foreground transition-all border border-transparent hover:border-border-custom"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(tool.id)}
                  className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {tools.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-border-custom">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No tools created yet</h3>
              <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">
                Expand your platform by adding interactive utilities for your users.
              </p>
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-8 bg-primary text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
              >
                Create First Tool
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
