"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  PenSquare,
  Sprout,
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getBlogs } from "@/services/blog.service";
import { IBlog } from "@/types/blog";

const CATEGORIES = [
  "All",
  "Soil Health",
  "Crop Protection",
  "Smart Irrigation",
  "Organic Farming",
  "Modern Tech",
];

export default function BlogHubPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const isExpert = user?.role?.toUpperCase() === "EXPERT" || user?.role?.toUpperCase() === "ADMIN";

  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const res = await getBlogs({
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
        });
        setBlogs(res.blogs || []);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadBlogs();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Featured post is the first article if available
  const featuredBlog = useMemo(() => {
    return blogs.length > 0 ? blogs[0] : null;
  }, [blogs]);

  const regularBlogs = useMemo(() => {
    return blogs.length > 1 ? blogs.slice(1) : blogs;
  }, [blogs]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#063B2B] via-[#0B513D] to-[#063B2B] px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-xs">
            <Sprout className="h-4 w-4 text-emerald-400" />
            <span>AgriNova Agricultural Knowledge Hub</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Practical Guides & Expert Farming Insights
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-100 sm:text-lg">
            Discover field-tested techniques, crop pathology solutions, and modern precision farming breakthroughs written directly by certified agricultural specialists.
          </p>

          {/* Expert Action Banner if logged in */}
          {isExpert && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-400/30 bg-white/10 px-5 py-3 backdrop-blur-md">
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Verified Expert: You have publication rights
              </span>
              <div className="flex gap-2">
                <Link
                  href="/dashboard/expert/blogs"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-3.5 py-1.5 text-xs font-bold text-[#063B2B] transition hover:bg-emerald-300"
                >
                  <PenSquare className="h-3.5 w-3.5" />
                  Write or Manage Articles
                </Link>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, crops, soil, pest, or expert name..."
                className="w-full rounded-2xl border border-emerald-400/30 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-xl placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-slate-200 bg-white sticky top-16 z-20 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#063B2B] text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs animate-pulse"
              >
                <div className="h-48 w-full bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-full bg-slate-200 rounded" />
                  <div className="h-4 w-2/3 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="my-16 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#063B2B]">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">No Articles Found</h3>
            <p className="mt-1 text-sm text-slate-500">
              We couldn&apos;t find any articles matching your search criteria. Try a different keyword or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#063B2B] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0B513D]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Spotlight / Featured Blog (only on 'All' or if match exists) */}
            {featuredBlog && !searchQuery && selectedCategory === "All" && (
              <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-6 shadow-sm transition hover:shadow-md lg:p-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured Guide
                      </span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {featuredBlog.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredBlog.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${featuredBlog.slug || featuredBlog._id}`}>
                      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 transition hover:text-[#063B2B] sm:text-3xl">
                        {featuredBlog.title}
                      </h2>
                    </Link>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base line-clamp-3">
                      {featuredBlog.summary}
                    </p>

                    {/* Author Mini Card */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-emerald-200 bg-emerald-100">
                          {featuredBlog.author?.avatar ? (
                            <Image
                              src={featuredBlog.author.avatar}
                              alt={featuredBlog.author.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-emerald-800">
                              {featuredBlog.author?.name?.slice(0, 2).toUpperCase() || "EX"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {featuredBlog.author?.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {featuredBlog.author?.title || "Agricultural Expert"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug || featuredBlog._id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#063B2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0B513D]"
                      >
                        Read Article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Featured Blog Images (1 or 2 images layout) */}
                  <div className="lg:col-span-5">
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-inner group aspect-video sm:aspect-4/3">
                      <Image
                        src={featuredBlog.images?.[0] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000"}
                        alt={featuredBlog.title}
                        fill
                        priority
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      {featuredBlog.images && featuredBlog.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                          <ImageIcon className="h-3 w-3" />
                          <span>2 Photos</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  {selectedCategory === "All" ? "Latest Farming Articles" : `${selectedCategory} Articles`}
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  Showing {blogs.length} {blogs.length === 1 ? "article" : "articles"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(searchQuery || selectedCategory !== "All" ? blogs : regularBlogs).map((blog) => (
                  <article
                    key={blog._id || blog.slug}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Image Header with Indicators */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 group">
                      <Image
                        src={blog.images?.[0] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800"}
                        alt={blog.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#063B2B] shadow-xs backdrop-blur-xs">
                          {blog.category}
                        </span>
                      </div>
                      {blog.images && blog.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                          <ImageIcon className="h-3 w-3" />
                          <span>2 Photos</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.readTime}
                        </span>
                      </div>

                      <Link href={`/blog/${blog.slug || blog._id}`} className="mt-2.5">
                        <h4 className="text-base font-bold text-slate-900 leading-snug transition hover:text-[#063B2B] line-clamp-2">
                          {blog.title}
                        </h4>
                      </Link>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">
                        {blog.summary}
                      </p>

                      {/* Author Info */}
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50">
                            {blog.author?.avatar ? (
                              <Image
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-emerald-800">
                                {blog.author?.name?.slice(0, 2).toUpperCase() || "EX"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-900">
                              {blog.author?.name}
                            </p>
                            <p className="truncate text-[10px] text-slate-500">
                              {blog.author?.title || "Specialist"}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/blog/${blog.slug || blog._id}`}
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#063B2B] hover:text-[#0B513D]"
                        >
                          Read
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}