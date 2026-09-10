"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  PenSquare,
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/services/blog.service";
import { IBlog, IBlogFormData } from "@/types/blog";

const FARMING_CATEGORIES = [
  "Soil Health",
  "Crop Protection",
  "Smart Irrigation",
  "Organic Farming",
  "Modern Tech",
  "Harvest & Storage",
];

const PRESET_FARMING_PHOTOS = [
  {
    label: "Soil & Microbes",
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop&q=80",
  },
  {
    label: "Sprouting Seedlings",
    url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&auto=format&fit=crop&q=80",
  },
  {
    label: "Drip Irrigation",
    url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1000&auto=format&fit=crop&q=80",
  },
  {
    label: "Tomato Cultivation",
    url: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23996?w=1000&auto=format&fit=crop&q=80",
  },
  {
    label: "Paddy & Rice Field",
    url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1000&auto=format&fit=crop&q=80",
  },
  {
    label: "Hydroponic Greens",
    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80",
  },
];

export default function ExpertBlogsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<IBlogFormData>({
    title: "",
    category: "Soil Health",
    tags: ["Farming", "Agronomy"],
    summary: "",
    content: "",
    images: [PRESET_FARMING_PHOTOS[0].url],
    status: "PUBLISHED",
    readTime: "4 min read",
  });

  const [tagInput, setTagInput] = useState("");
  const [image1, setImage1] = useState(PRESET_FARMING_PHOTOS[0].url);
  const [image2, setImage2] = useState("");

  const loadAllBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogs();
      setBlogs(res.blogs || []);
    } catch (err) {
      console.error("Failed to fetch expert blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      category: "Soil Health",
      tags: ["Farming", "Agronomy"],
      summary: "",
      content: "",
      images: [PRESET_FARMING_PHOTOS[0].url],
      status: "PUBLISHED",
      readTime: "4 min read",
    });
    setImage1(PRESET_FARMING_PHOTOS[0].url);
    setImage2("");
    setTagInput("");
    setModalOpen(true);
    setFeedback(null);
  };

  const openEditModal = (blog: IBlog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      tags: blog.tags || [],
      summary: blog.summary,
      content: blog.content,
      images: blog.images || [],
      status: blog.status,
      readTime: blog.readTime,
    });
    setImage1(blog.images?.[0] || "");
    setImage2(blog.images?.[1] || "");
    setTagInput("");
    setModalOpen(true);
    setFeedback(null);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (t: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== t),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Build images array (1 or 2 images)
    const images: string[] = [];
    if (image1.trim()) images.push(image1.trim());
    if (image2.trim()) images.push(image2.trim());

    if (images.length === 0) {
      setFeedback({
        type: "error",
        message: "Please provide at least 1 image URL (maximum 2).",
      });
      setSaving(false);
      return;
    }

    const payload: IBlogFormData = {
      ...formData,
      images,
    };

    try {
      if (editingBlog) {
        const res = await updateBlog(editingBlog._id || editingBlog.slug, payload);
        if (res.success) {
          setFeedback({
            type: "success",
            message: "Blog article updated successfully!",
          });
          setTimeout(() => {
            setModalOpen(false);
            loadAllBlogs();
          }, 1200);
        } else {
          setFeedback({
            type: "error",
            message: res.message || "Failed to update article",
          });
        }
      } else {
        const res = await createBlog(payload);
        if (res.success) {
          setFeedback({
            type: "success",
            message: "New farming blog published to http://localhost:3000/blog!",
          });
          setTimeout(() => {
            setModalOpen(false);
            loadAllBlogs();
          }, 1200);
        } else {
          setFeedback({
            type: "error",
            message: res.message || "Failed to publish article",
          });
        }
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "An unexpected error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this farming blog article?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteBlog(id);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id && b.slug !== id));
      } else {
        alert(res.message || "Could not delete blog");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Blog Articles & Insights
            </h1>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              Expert Hub
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Publish, edit, and manage educational farming articles shown on the public blog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            <span>View Public Blog</span>
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#063B2B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0B513D] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Blog</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Total Published Articles
            </span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {blogs.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Live on AgriNova Public Blog
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Topic Coverage
            </span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {new Set(blogs.map((b) => b.category)).size} Categories
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Soil, Irrigation, Protection & Tech
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Article Pictures Standard
            </span>
            <ImageIcon className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            1 to 2 Photos
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            High-definition visual guides
          </p>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Articles Directory</h2>
          <button
            onClick={loadAllBlogs}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
            <p className="mt-2 text-xs">Loading articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              No blog articles found.
            </p>
            <p className="text-xs text-slate-500">
              Click &quot;Create New Blog&quot; to publish your first article.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {blogs.map((blog) => (
              <div
                key={blog._id || blog.slug}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <Image
                      src={
                        blog.images?.[0] ||
                        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400"
                      }
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                    {blog.images && blog.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1 text-[9px] font-bold text-white">
                        2 pics
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {blog.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {blog.readTime}
                      </span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                        {blog.status}
                      </span>
                    </div>

                    <h3 className="mt-1 text-sm font-bold text-slate-900 truncate">
                      {blog.title}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500 truncate max-w-xl">
                      {blog.summary}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Author: {blog.author?.name}</span>
                      <span>•</span>
                      <span>{blog.views || 0} views</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <Link
                    href={`/blog/${blog.slug || blog._id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openEditModal(blog)}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#063B2B] hover:bg-emerald-100"
                  >
                    <PenSquare className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === blog._id}
                    onClick={() => handleDelete(blog._id || blog.slug)}
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete Article"
                  >
                    {deletingId === blog._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#063B2B]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingBlog ? "Edit Farming Article" : "Create New Farming Article"}
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in article details, upload 1-2 images, and publish to the public blog.
                </p>
              </div>
            </div>

            {feedback && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3.5 text-xs font-semibold ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Biological Nematode Suppression Using Mustard Biofumigation"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#063B2B] focus:outline-none focus:ring-1 focus:ring-[#063B2B]"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Farming Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#063B2B] focus:outline-none focus:ring-1 focus:ring-[#063B2B]"
                  >
                    {FARMING_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "PUBLISHED" | "DRAFT",
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#063B2B] focus:outline-none focus:ring-1 focus:ring-[#063B2B]"
                  >
                    <option value="PUBLISHED">Published (Visible Publicly)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Topic Tags
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Add..."
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#063B2B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-emerald-600 hover:text-emerald-950"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Article Summary / Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="A concise 2-sentence overview that appears on the card..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#063B2B] focus:outline-none"
                />
              </div>

              {/* IMAGES (1 to 2 images requirement) */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-emerald-700" />
                    Article Pictures (1 to 2 pictures required)
                  </label>
                  <span className="text-[11px] text-emerald-700">
                    High quality agriculture photos
                  </span>
                </div>

                {/* Preset quick pickers */}
                <div className="mt-2.5">
                  <p className="text-[11px] font-semibold text-slate-600">
                    Quick Select Preset Farming Photos:
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {PRESET_FARMING_PHOTOS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          if (!image1) setImage1(preset.url);
                          else if (!image2) setImage2(preset.url);
                          else setImage1(preset.url);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-emerald-100 hover:text-emerald-900"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image 1 Input & Preview */}
                <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-8">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Picture 1 (Primary / Hero Image) *
                    </label>
                    <input
                      type="url"
                      required
                      value={image1}
                      onChange={(e) => setImage1(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#063B2B] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    {image1 ? (
                      <div className="relative h-16 w-full overflow-hidden rounded-xl border border-slate-200">
                        <Image
                          src={image1}
                          alt="Picture 1 Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-[11px] text-slate-400">
                        No Picture 1
                      </div>
                    )}
                  </div>
                </div>

                {/* Image 2 Input & Preview */}
                <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-8">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700">
                        Picture 2 (Secondary In-Article Visual) - Optional
                      </label>
                      {image2 && (
                        <button
                          type="button"
                          onClick={() => setImage2("")}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                      placeholder="https://images.unsplash.com/... (optional second picture)"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-[#063B2B] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    {image2 ? (
                      <div className="relative h-16 w-full overflow-hidden rounded-xl border border-slate-200">
                        <Image
                          src={image2}
                          alt="Picture 2 Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-[11px] text-slate-400">
                        Optional Picture 2
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Full Article Content <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-slate-400 mb-1">
                  Supports Markdown headings (### Section Title) and bullet points (- Item).
                </p>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write the full farming advice, steps, or observations here..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:border-[#063B2B] focus:outline-none"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  placeholder="e.g. 5 min read"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#063B2B] focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#063B2B] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0B513D] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{editingBlog ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
