"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  CheckCircle2,
  Sprout,
  PenSquare,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getBlogByIdOrSlug } from "@/services/blog.service";
import { IBlog, IBlogSingleResponse } from "@/types/blog";

export default function SingleBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [data, setData] = useState<IBlogSingleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      setLoading(true);
      try {
        const res = await getBlogByIdOrSlug(resolvedParams.id);
        setData(res);
      } catch (err) {
        console.error("Failed to load blog:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [resolvedParams.id]);

  const blog = data?.blog;
  const nextBlog = data?.nextBlog;
  const prevBlog = data?.prevBlog;

  const isAuthorOrAdmin =
    user &&
    (user.role?.toUpperCase() === "ADMIN" ||
      user.id === blog?.author?.id ||
      user.email === blog?.author?.email);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-32 rounded-lg bg-slate-200" />
          <div className="h-10 w-3/4 rounded-xl bg-slate-200" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-200" />
            </div>
          </div>
          <div className="h-96 w-full rounded-2xl bg-slate-200" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
            <div className="h-4 w-4/6 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Sprout className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Article Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">
          The requested farming article may have been moved or removed.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#063B2B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Hub
        </Link>
      </div>
    );
  }

  const primaryImage = blog.images?.[0];
  const secondaryImage = blog.images?.[1];

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* Top Header & Navigation Bar */}
      <div className="border-b border-slate-200 bg-slate-50/80 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-[#063B2B]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Farming Articles</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthorOrAdmin && (
              <Link
                href="/dashboard/expert/blogs"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100"
              >
                <PenSquare className="h-3.5 w-3.5" />
                <span>Edit in Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Category, Date, Read Time */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-[#063B2B]">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {blog.readTime}
          </span>
          {blog.views !== undefined && blog.views > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Eye className="h-3.5 w-3.5" />
                {blog.views} reads
              </span>
            </>
          )}
        </div>

        {/* Title & Summary */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
          {blog.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600 border-l-4 border-emerald-500 pl-4 italic">
          {blog.summary}
        </p>

        {/* Author Header */}
        <div className="mt-8 flex items-center justify-between border-y border-slate-200 py-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-emerald-200 bg-emerald-50">
              {blog.author?.avatar ? (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-emerald-800">
                  {blog.author?.name?.slice(0, 2).toUpperCase() || "EX"}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">
                  {blog.author?.name}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Expert
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {blog.author?.title || "Agricultural Specialist"}
              </p>
            </div>
          </div>

          <Link
            href="/consultant"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#063B2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0B513D]"
          >
            Consult Expert
          </Link>
        </div>

        {/* Primary Picture (Picture 1 of 1 or 2) */}
        {primaryImage && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <div className="relative aspect-video w-full">
              <Image
                src={primaryImage}
                alt={blog.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
            <div className="bg-slate-50 px-4 py-2.5 text-center text-xs text-slate-500">
              Field documentation: {blog.category} practices at AgriNova partner farms.
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <div className="mt-10 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700">
          {blog.content.split("\n\n").map((paragraph, index) => {
            // Check if paragraph is markdown heading
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="mt-8 text-xl font-bold text-slate-900">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="mt-10 text-2xl font-bold text-slate-900">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }

            // Check if it's a bulleted list
            if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n- ").map((item) => item.replace(/^- /, ""));
              return (
                <ul key={index} className="my-4 list-disc space-y-2 pl-5 text-slate-700">
                  {items.map((item, idx) => (
                    <li key={idx} className="text-sm sm:text-base leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            // Regular paragraph
            return (
              <p key={index} className="my-4 text-base leading-relaxed text-slate-700 sm:text-lg">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Secondary Picture (Picture 2 of 2) if present */}
        {secondaryImage && (
          <div className="my-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-xs">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={secondaryImage}
                alt={`${blog.title} - Supplementary Visual`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
            <div className="p-3 text-center text-xs font-medium text-slate-600">
              Key Visual Observation: Advanced farming application and implementation details.
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6">
            <span className="text-xs font-semibold text-slate-500">Related Tags:</span>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comprehensive Author Bio Card */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-100 shadow-sm">
              {blog.author?.avatar ? (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-emerald-900">
                  {blog.author?.name?.slice(0, 2).toUpperCase() || "EX"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{blog.author?.name}</h3>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  <Sparkles className="h-3 w-3 text-emerald-700" />
                  Verified Agricultural Specialist
                </span>
              </div>

              <p className="mt-1 text-xs font-semibold text-emerald-800">
                {blog.author?.title || "Field Agronomist"}
                {blog.author?.specialization ? ` • ${blog.author.specialization}` : ""}
              </p>

              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {blog.author?.bio ||
                  "Senior farming advisor dedicated to empowering growers with sustainable, high-yield agricultural strategies and research."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/consultant"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#063B2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0B513D]"
                >
                  Book 1-on-1 Consultation
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  More articles from AgriNova experts &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT BLOG REDIRECTION SECTION */}
        {nextBlog && (
          <section className="mt-14 overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-950 to-[#063B2B] p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <ArrowRight className="h-3.5 w-3.5" />
                <span>Next Recommended Article</span>
              </div>
              <span className="text-xs text-emerald-300">{nextBlog.readTime}</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
              <div className="sm:col-span-8">
                <span className="text-xs font-medium text-emerald-200">
                  Category: {nextBlog.category}
                </span>
                <h4 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl line-clamp-2">
                  {nextBlog.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-emerald-100 sm:text-sm line-clamp-2">
                  {nextBlog.summary}
                </p>

                <div className="mt-5">
                  <Link
                    href={`/blog/${nextBlog.slug || nextBlog._id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-2.5 text-xs font-extrabold text-[#063B2B] shadow-md transition hover:bg-emerald-300 active:scale-95"
                  >
                    <span>Read Next Article Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Next blog thumbnail preview */}
              <div className="sm:col-span-4">
                <Link
                  href={`/blog/${nextBlog.slug || nextBlog._id}`}
                  className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-emerald-500/30"
                >
                  <Image
                    src={
                      nextBlog.images?.[0] ||
                      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600"
                    }
                    alt={nextBlog.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition group-hover:bg-transparent" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Previous & Next Mini Footer Nav */}
        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
          {prevBlog ? (
            <Link
              href={`/blog/${prevBlog.slug || prevBlog._id}`}
              className="group flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#063B2B]"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-normal">Previous</p>
                <p className="truncate max-w-44 sm:max-w-60">{prevBlog.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextBlog && (
            <Link
              href={`/blog/${nextBlog.slug || nextBlog._id}`}
              className="group flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#063B2B]"
            >
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-normal">Next Story</p>
                <p className="truncate max-w-44 sm:max-w-60">{nextBlog.title}</p>
              </div>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
