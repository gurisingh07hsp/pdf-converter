"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Info } from "lucide-react";
import { tools } from "@/lib/tools";

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
}

const toolsList = tools.map((tool) => ({
  id: tool.slug || "",
  name: tool.title
}));

export default function SEOManagement() {
  const [selectedTool, setSelectedTool] = useState(toolsList[0].id);
  const [settings, setSettings] = useState<Record<string, SEOSettings>>({});
  const [currentSettings, setCurrentSettings] = useState<SEOSettings>({ title: "", description: "", keywords: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings[selectedTool]) {
      setCurrentSettings(settings[selectedTool]);
    } else {
      // Try to use default SEO settings from tools.ts if available
      const tool = tools.find(t => t.slug === selectedTool);
      setCurrentSettings({ 
        title: tool?.seo?.metaTitle || "", 
        description: tool?.seo?.metaDescription || "", 
        keywords: tool?.seo?.keywords || "" 
      });
    }
  }, [selectedTool, settings]);

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/seo");
    const data = await res.json();
    setSettings(data);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool: selectedTool, settings: currentSettings }),
    });
    if (res.ok) {
      setSettings({ ...settings, [selectedTool]: currentSettings });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">SEO Settings</h1>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Globe className="w-4 h-4 text-primary" /> Multi-tool SEO Optimization
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tool Selector */}
        <div className="lg:col-span-1 space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Select Tool</label>
          <div className="bg-white rounded-2xl border border-border-custom overflow-hidden shadow-sm max-h-[70vh] overflow-y-auto">
            {toolsList.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-full text-left px-6 py-4 text-sm font-bold transition-all border-b border-border-custom last:border-none ${
                  selectedTool === tool.id 
                    ? "bg-primary text-white" 
                    : "text-gray-500 hover:bg-surface hover:text-foreground"
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* SEO Form */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-border-custom shadow-sm space-y-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-2">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-900">Editing SEO for: {toolsList.find(t => t.id === selectedTool)?.name}</p>
                <p className="text-xs text-blue-700 mt-1">These settings will update the meta tags and search appearance for this specific tool page.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Title</label>
              <input 
                type="text" 
                value={currentSettings.title}
                onChange={(e) => setCurrentSettings({ ...currentSettings, title: e.target.value })}
                className="w-full bg-surface border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                placeholder="e.g. Merge PDF - Combine Multiple Files Online for Free"
              />
              <p className="text-[10px] text-gray-400 font-medium">Recommended length: 50-60 characters. Current: {currentSettings.title.length}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Description</label>
              <textarea 
                rows={4}
                value={currentSettings.description}
                onChange={(e) => setCurrentSettings({ ...currentSettings, description: e.target.value })}
                className="w-full bg-surface border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-medium"
                placeholder="Briefly describe what this tool does for search engines..."
              />
              <p className="text-[10px] text-gray-400 font-medium">Recommended length: 150-160 characters. Current: {currentSettings.description.length}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Focus Keywords</label>
              <input 
                type="text" 
                value={currentSettings.keywords}
                onChange={(e) => setCurrentSettings({ ...currentSettings, keywords: e.target.value })}
                className="w-full bg-surface border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                placeholder="e.g. merge pdf, combine pdf, join pdf files"
              />
              <p className="text-[10px] text-gray-400 font-medium">Separate keywords with commas.</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-border-custom">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save SEO Settings"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white p-8 rounded-2xl border border-border-custom shadow-sm space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Search Result Preview</label>
            <div className="max-w-xl">
              <p className="text-[14px] text-[#1a0dab] hover:underline cursor-pointer mb-1 truncate font-medium">
                {currentSettings.title || "Your Tool Title Will Appear Here"}
              </p>
              <p className="text-[12px] text-[#006621] mb-1 truncate">https://pdfswift.com/convert/{selectedTool}</p>
              <p className="text-[13px] text-[#545454] line-clamp-2 leading-relaxed">
                {currentSettings.description || "Enter a meta description to see how your tool will appear in Google search results."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
