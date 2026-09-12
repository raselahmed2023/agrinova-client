"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit3, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { createBlog, deleteBlog, getMyBlogs, updateBlog, uploadBlogImage } from "@/services/blog.service";
import type { IBlog, IBlogFormData } from "@/types/blog";

const blank: IBlogFormData = {
  title: "",
  category: "Crop Management",
  tags: [],
  summary: "",
  content: "",
  images: [],
  status: "PUBLISHED",
};

export default function ExpertBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [form, setForm] = useState<IBlogFormData>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagText, setTagText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setBlogs(await getMyBlogs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load your articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const reset = () => {
    setForm(blank);
    setTagText("");
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const edit = (blog: IBlog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title,
      category: blog.category,
      tags: blog.tags || [],
      summary: blog.summary,
      content: blog.content,
      images: blog.images || [],
      status: blog.status,
    });
    setTagText((blog.tags || []).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadCover = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const url = await uploadBlogImage(file);
      setForm((current) => ({ ...current, images: [url] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload cover image");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.images[0]) return setError("Please upload a cover image");
    const payload: IBlogFormData = {
      ...form,
      tags: tagText.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 8),
    };
    try {
      setSaving(true);
      setError("");
      if (editingId) {
        await updateBlog(editingId, payload);
        setMessage("Article updated successfully.");
      } else {
        await createBlog(payload);
        setMessage("Article saved successfully.");
      }
      reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save article");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await deleteBlog(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete article");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-800 p-7 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">Expert publishing</p>
        <h1 className="mt-2 text-3xl font-black">Agricultural Blog Studio</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50/90">Only Expert accounts can create, edit or delete articles. The form is intentionally short: title, category, summary, cover image and article body.</p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_.85fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-black text-slate-950">{editingId ? "Edit article" : "Write article"}</h2><p className="text-sm text-slate-500">Keep it useful, focused and easy to read.</p></div>{editingId && <button type="button" onClick={reset} className="rounded-xl border border-slate-200 p-2 text-slate-500"><X className="h-4 w-4" /></button>}</div>

          <div className="grid gap-5">
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={180} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="A clear, useful farming topic" /></label>
            <div className="grid gap-5 md:grid-cols-2"><label className="space-y-2"><span className="text-sm font-bold text-slate-700">Category</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required maxLength={80} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="Soil Health" /></label><label className="space-y-2"><span className="text-sm font-bold text-slate-700">Status</span><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "PUBLISHED" | "DRAFT" })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600"><option value="PUBLISHED">Publish</option><option value="DRAFT">Save draft</option></select></label></div>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Short summary</span><textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required rows={3} maxLength={500} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="What will readers learn?" /></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Tags <span className="font-normal text-slate-400">optional, comma separated</span></span><input value={tagText} onChange={(e) => setTagText(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="rice, irrigation, pest management" /></label>

            <div className="space-y-2"><span className="text-sm font-bold text-slate-700">Cover image</span><label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-600 hover:border-emerald-400"><input type="file" accept="image/*" className="hidden" onChange={(e) => void uploadCover(e.target.files?.[0])} />{uploading ? <Loader2 className="h-5 w-5 animate-spin text-emerald-700" /> : <ImagePlus className="h-5 w-5 text-emerald-700" />}{uploading ? "Uploading to ImgBB..." : "Choose cover image"}</label>{form.images[0] && <img src={form.images[0]} alt="Cover preview" className="h-52 w-full rounded-2xl object-cover" />}</div>

            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Article</span><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={14} maxLength={30000} className="w-full rounded-xl border border-slate-200 px-4 py-3 font-sans leading-7 outline-none focus:border-emerald-600" placeholder="Write the article here. You can use simple Markdown headings and lists." /></label>
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          <button disabled={saving || uploading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 font-black text-white hover:bg-emerald-800 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? "Update article" : "Save article"}</button>
        </form>

        <section className="space-y-4"><div><h2 className="text-xl font-black text-slate-950">Your articles</h2><p className="text-sm text-slate-500">Only you can edit or delete articles you authored.</p></div>{loading ? <div className="flex min-h-48 items-center justify-center rounded-3xl border border-slate-200 bg-white"><Loader2 className="h-7 w-7 animate-spin text-emerald-700" /></div> : blogs.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No article yet.</div> : blogs.map((blog) => <article key={blog._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">{blog.images[0] && <img src={blog.images[0]} alt={blog.title} className="h-44 w-full object-cover" />}<div className="p-5"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{blog.status}</span><span className="text-xs text-slate-400">{blog.readTime}</span></div><h3 className="mt-3 text-lg font-black text-slate-950">{blog.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{blog.summary}</p><div className="mt-4 flex gap-2"><button onClick={() => edit(blog)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"><Edit3 className="h-4 w-4" />Edit</button><button onClick={() => void remove(blog._id)} className="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-red-700"><Trash2 className="h-4 w-4" /></button></div></div></article>)}</section>
      </div>
    </div>
  );
}
