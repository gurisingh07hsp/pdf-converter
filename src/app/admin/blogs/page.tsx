"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Table, 
  Quote, 
  Code, 
  Undo2, 
  Redo2,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  tags: string[];
  seo: {
    metaTitle: string;
    focusKeyword: string;
    metaDescription: string;
    slug: string;
    canonical: string;
  };
  createdAt: string;
}

const CATEGORIES = ["Select Category", "PDF Tools", "Tutorials", "Productivity", "Business", "Tech"];

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
    title: "",
    author: "",
    category: "Select Category",
    readTime: "5",
    excerpt: "",
    content: "",
    tags: [],
    seo: {
      metaTitle: "",
      focusKeyword: "",
      metaDescription: "",
      slug: "",
      canonical: ""
    }
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    setBlogs(data);
  };

  const handleSave = async () => {
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentBlog),
    });
    if (res.ok) {
      setIsEditing(false);
      resetForm();
      fetchBlogs();
    }
  };

  const resetForm = () => {
    setCurrentBlog({
      title: "",
      author: "",
      category: "Select Category",
      readTime: "5",
      excerpt: "",
      content: "",
      tags: [],
      seo: {
        metaTitle: "",
        focusKeyword: "",
        metaDescription: "",
        slug: "",
        canonical: ""
      }
    });
  };

  const generateSlug = () => {
    if (!currentBlog.title) return;
    const slug = currentBlog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setCurrentBlog({
      ...currentBlog,
      seo: { ...currentBlog.seo!, slug }
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!currentBlog.tags?.includes(tagInput.trim())) {
        setCurrentBlog({
          ...currentBlog,
          tags: [...(currentBlog.tags || []), tagInput.trim()]
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentBlog({
      ...currentBlog,
      tags: currentBlog.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const handleEdit = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch("/api/admin/blogs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Management</h1>
          <p className="text-sm text-gray-400 font-medium">Manage your blog posts and content</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Add New Blog
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white rounded-[2rem] border border-border-custom shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-8 border-b border-border-custom bg-gray-50/50">
            <h2 className="text-lg font-bold text-foreground">Add New Blog Post</h2>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Row 1: Title & Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Title</label>
                <input 
                  type="text" 
                  value={currentBlog.title}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter blog title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Author</label>
                <input 
                  type="text" 
                  value={currentBlog.author}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, author: e.target.value })}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Row 2: Category & Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                <div className="relative">
                  <select 
                    value={currentBlog.category}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                    className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Read Time (minutes)</label>
                <input 
                  type="number" 
                  value={currentBlog.readTime}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, readTime: e.target.value })}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="5"
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Featured Images</label>
                <div className="flex items-center gap-3 w-full bg-white border border-border-custom px-4 py-2.5 rounded-xl">
                  <input type="file" className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface file:text-foreground hover:file:bg-gray-100 cursor-pointer w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Content Image</label>
                <div className="flex items-center gap-3 w-full bg-white border border-border-custom px-4 py-2.5 rounded-xl">
                  <input type="file" className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface file:text-foreground hover:file:bg-gray-100 cursor-pointer w-full" />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Excerpt</label>
              <textarea 
                rows={3}
                value={currentBlog.excerpt}
                onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Brief summary of the blog post..."
              />
            </div>

            {/* Content with Toolbar */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Content</label>
              <div className="border border-border-custom rounded-2xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="bg-surface p-2 border-b border-border-custom flex flex-wrap gap-1">
                  {[
                    { icon: Bold }, { icon: Italic }, { icon: Underline }, { icon: Strikethrough },
                    { divider: true },
                    { label: "Paragraph", dropdown: true },
                    { divider: true },
                    { icon: List }, { icon: ListOrdered },
                    { divider: true },
                    { icon: AlignLeft }, { icon: AlignCenter }, { icon: AlignRight },
                    { divider: true },
                    { icon: LinkIcon }, { icon: ImageIcon }, { icon: Table }, { icon: Quote }, { icon: Code },
                    { divider: true },
                    { icon: Undo2 }, { icon: Redo2 }
                  ].map((item, i) => (
                    item.divider ? (
                      <div key={`d-${i}`} className="w-px h-6 bg-border-custom mx-1 self-center" />
                    ) : item.dropdown ? (
                      <button key={`b-${i}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-custom bg-white text-[11px] font-bold text-foreground hover:bg-gray-50">
                        {item.label} <ChevronDown className="w-3 h-3" />
                      </button>
                    ) : item.icon ? (
                      <button key={`b-${i}`} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all">
                        <item.icon className="w-4 h-4" />
                      </button>
                    ) : null
                  ))}
                </div>
                <textarea 
                  rows={12}
                  value={currentBlog.content}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                  className="w-full bg-white px-6 py-4 text-sm focus:outline-none resize-none min-h-[300px]"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Tags</label>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Add a tag and press Enter"
                />
                <div className="flex flex-wrap gap-2">
                  {currentBlog.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-custom text-xs font-bold text-foreground group">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="pt-8 border-t border-border-custom space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-foreground">SEO Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Meta Title ({currentBlog.seo?.metaTitle.length || 0}/60)</label>
                  </div>
                  <input 
                    type="text" 
                    value={currentBlog.seo?.metaTitle}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo: { ...currentBlog.seo!, metaTitle: e.target.value }})}
                    className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="SEO title for search engines"
                  />
                  <p className="text-[10px] text-gray-300 font-medium italic">Recommended: 50-60 characters</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Focus Keyword</label>
                  <input 
                    type="text" 
                    value={currentBlog.seo?.focusKeyword}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo: { ...currentBlog.seo!, focusKeyword: e.target.value }})}
                    className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Main keyword for this post"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Meta Description ({currentBlog.seo?.metaDescription.length || 0}/160)</label>
                </div>
                <textarea 
                  rows={3}
                  value={currentBlog.seo?.metaDescription}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, seo: { ...currentBlog.seo!, metaDescription: e.target.value }})}
                  className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Brief description for search engine results"
                />
                <p className="text-[10px] text-gray-300 font-medium italic px-1">Recommended: 150-160 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">URL Slug</label>
                  <div className="flex gap-2">
                    <div className="flex-grow flex items-center bg-surface border border-border-custom rounded-xl px-4 py-3">
                      <span className="text-gray-300 text-xs font-medium">/blog/</span>
                      <input 
                        type="text" 
                        value={currentBlog.seo?.slug}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, seo: { ...currentBlog.seo!, slug: e.target.value }})}
                        className="flex-grow bg-transparent border-none text-sm focus:outline-none ml-1"
                        placeholder="url-friendly-slug"
                      />
                    </div>
                    <button 
                      onClick={generateSlug}
                      className="px-4 py-2 bg-surface border border-border-custom rounded-xl text-[10px] font-black uppercase hover:bg-gray-100 transition-all"
                    >
                      Auto
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-300 font-medium italic px-1">URL-friendly version of your title</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Canonical URL</label>
                  <input 
                    type="text" 
                    value={currentBlog.seo?.canonical}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, seo: { ...currentBlog.seo!, canonical: e.target.value }})}
                    className="w-full bg-white border border-border-custom px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="https://example.com/blog/post-url"
                  />
                  <p className="text-[10px] text-gray-300 font-medium italic px-1">Preferred URL for this content (optional)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 border-t border-border-custom flex gap-3">
            <button 
              onClick={handleSave}
              className="bg-[#f97316] text-white px-10 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-orange-500/20"
            >
              {currentBlog.id ? "Update Blog" : "Create Blog"}
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

      {/* Blog List Preview */}
      {!isEditing && (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-[1.5rem] border border-border-custom shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter rounded">
                      {blog.category}
                    </span>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{blog.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span>By {blog.author}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{blog.readTime} min read</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(blog)}
                  className="p-2.5 rounded-xl text-gray-400 hover:bg-surface hover:text-foreground transition-all border border-transparent hover:border-border-custom"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(blog.id)}
                  className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-border-custom">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No blog posts yet</h3>
              <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium">
                Ready to share some knowledge? Create your first blog post to engage with your users.
              </p>
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-8 bg-primary text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
