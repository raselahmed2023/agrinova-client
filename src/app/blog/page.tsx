"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  Image as ImageIcon,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
} from "lucide-react";

import { getBlogs } from "@/services/blog.service";
import type { IBlog } from "@/types/blog";

/* =========================================================
   CONFIG
========================================================= */

const CATEGORIES = [
  "All",
  "Crop Management",
  "Soil Health",
  "Crop Protection",
  "Smart Irrigation",
  "Organic Farming",
  "Modern Tech",
];

const HERO_TOPICS = [
  "Crop Management",
  "Soil Health",
  "Crop Protection",
  "Smart Irrigation",
  "Organic Farming",
  "Modern Tech",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80";

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  dateString?: string
) {
  if (!dateString) {
    return "Recent";
  }

  const date =
    new Date(
      dateString
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Recent";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function getAuthorInitials(
  name?: string
) {
  if (!name) {
    return "EX";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0)
    )
    .join("")
    .toUpperCase();
}

/* =========================================================
   PAGE
========================================================= */

export default function BlogHubPage() {
  const [
    blogs,
    setBlogs,
  ] =
    useState<
      IBlog[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState("All");

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  /* =======================================================
     LOAD BLOGS
  ======================================================= */

  useEffect(() => {
    let active =
      true;

    const loadBlogs =
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const result =
            await getBlogs({
              category:
                selectedCategory !==
                "All"
                  ? selectedCategory
                  : undefined,

              search:
                searchQuery
                  .trim() ||
                undefined,
            });

          if (!active) {
            return;
          }

          setBlogs(
            Array.isArray(
              result.blogs
            )
              ? result.blogs
              : []
          );
        } catch (err) {
          if (!active) {
            return;
          }

          console.error(
            "Failed to load blogs:",
            err
          );

          setBlogs([]);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load articles."
          );
        } finally {
          if (active) {
            setLoading(
              false
            );
          }
        }
      };

    const timer =
      window.setTimeout(
        () => {
          void loadBlogs();
        },
        220
      );

    return () => {
      active = false;

      window.clearTimeout(
        timer
      );
    };
  }, [
    selectedCategory,
    searchQuery,
  ]);

  /* =======================================================
     FEATURED
  ======================================================= */

  const featuredBlog =
    useMemo(
      () =>
        blogs.length >
        0
          ? blogs[0]
          : null,
      [blogs]
    );

  const regularBlogs =
    useMemo(
      () =>
        blogs.length >
        1
          ? blogs.slice(
              1
            )
          : [],
      [blogs]
    );

  const displayBlogs =
    searchQuery ||
    selectedCategory !==
      "All"
      ? blogs
      : regularBlogs;

  const resetFilters =
    () => {
      setSelectedCategory(
        "All"
      );

      setSearchQuery(
        ""
      );
    };

  return (
    <main className="min-h-screen bg-[#F5F8F3]">
      {/* ===================================================
          HERO — SAME STYLE AS INVESTMENT PAGE
      =================================================== */}

      <section className="relative overflow-hidden px-3 py-6 sm:px-4 lg:px-5 lg:py-8">
        {/* BACKGROUND */}

        <div className="absolute inset-0 -z-20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/marketplace-bg.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-white/5" />

          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-emerald-950/5" />
        </div>

        <div className="mx-auto w-full max-w-[1600px]">
          {/* GLASS HERO CARD */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/65 shadow-xl shadow-slate-900/10 backdrop-blur-md">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:p-9">
              {/* LEFT */}

              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
                  <Sprout className="h-3.5 w-3.5" />

                  AgriNova Knowledge Hub
                </div>

                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Practical Guides &{" "}
                  <span className="text-emerald-700">
                    Expert Farming
                    Insights
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  Learn practical
                  farming techniques
                  from verified
                  agricultural
                  experts and make
                  better decisions
                  for your farm.
                </p>

                {/* TOPICS */}

                <div className="mt-6">
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Explore Topics
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {HERO_TOPICS.map(
                      (
                        topic
                      ) => (
                        <button
                          key={
                            topic
                          }
                          type="button"
                          onClick={() =>
                            setSelectedCategory(
                              topic
                            )
                          }
                          className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100"
                        >
                          {
                            topic
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="rounded-[24px] border border-white/70 bg-white/55 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Knowledge Hub
                    </h2>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Expert knowledge
                      made practical
                      for farmers.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  {/* 1 */}

                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-800">
                      Learn from
                      Experts
                    </p>
                  </div>

                  {/* 2 */}

                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Lightbulb className="h-3.5 w-3.5" />
                    </div>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-800">
                      Apply in
                      the Field
                    </p>
                  </div>

                  {/* 3 */}

                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-800">
                      Improve
                      Results
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />

                  <p className="text-xs font-semibold leading-5 text-emerald-800">
                    Articles are
                    published by
                    verified
                    agricultural
                    specialists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          ARTICLES SECTION
      =================================================== */}

      <section className="mx-auto w-full max-w-[1600px] px-3 pb-16 pt-2 sm:px-4 lg:px-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {/* HEADER */}

          <div className="flex flex-col gap-5 border-b border-slate-100 pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                <Sparkles className="h-4 w-4" />

                Agricultural
                Knowledge
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                {selectedCategory ===
                "All"
                  ? "Latest Farming Articles"
                  : `${selectedCategory} Articles`}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Practical farming
                resources written
                to help farmers
                solve real field
                problems.
              </p>
            </div>

            {/* SMALL SEARCH */}

            <div className="w-full xl:max-w-md">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={
                    searchQuery
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchQuery(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search articles..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-16 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery(
                        ""
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER */}

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map(
              (
                category
              ) => {
                const active =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                      active
                        ? "bg-[#063B2B] text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {
                      category
                    }
                  </button>
                );
              }
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({
                length: 6,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="animate-pulse overflow-hidden rounded-[24px] border border-slate-200 bg-white"
                  >
                    <div className="h-52 bg-slate-100" />

                    <div className="space-y-4 p-5">
                      <div className="h-3 w-24 rounded bg-slate-100" />

                      <div className="h-6 w-3/4 rounded bg-slate-100" />

                      <div className="h-4 w-full rounded bg-slate-100" />

                      <div className="h-4 w-2/3 rounded bg-slate-100" />

                      <div className="h-10 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : blogs.length ===
            0 ? (
            /* =================================================
               EMPTY
            ================================================= */

            <div className="mt-7 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <BookOpen className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No articles
                found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We could not find
                an article matching
                your current search
                or category.
              </p>

              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="mt-5 rounded-xl bg-[#063B2B] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0B513D]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mt-7 space-y-10">
              {/* =================================================
                  FEATURED ARTICLE
              ================================================= */}

              {featuredBlog &&
                !searchQuery &&
                selectedCategory ===
                  "All" && (
                  <article className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/70 shadow-sm">
                    <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />

                    <div className="relative grid lg:grid-cols-2">
                      {/* CONTENT */}

                      <div className="flex flex-col justify-center p-6 sm:p-7 lg:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                            <Sparkles className="h-3.5 w-3.5" />

                            Featured
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                            {
                              featuredBlog.category
                            }
                          </span>
                        </div>

                        <Link
                          href={`/blog/${
                            featuredBlog.slug ||
                            featuredBlog._id
                          }`}
                        >
                          <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 transition hover:text-emerald-700 sm:text-3xl">
                            {
                              featuredBlog.title
                            }
                          </h3>
                        </Link>

                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                          {
                            featuredBlog.summary
                          }
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />

                            {formatDate(
                              featuredBlog.createdAt
                            )}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />

                            {
                              featuredBlog.readTime
                            }
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5" />

                            {
                              featuredBlog.views ||
                              0
                            }{" "}
                            views
                          </span>
                        </div>

                        {/* AUTHOR */}

                        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-200 bg-emerald-100">
                              {featuredBlog
                                .author
                                ?.avatar ? (
                                <Image
                                  src={
                                    featuredBlog
                                      .author
                                      .avatar
                                  }
                                  alt={
                                    featuredBlog
                                      .author
                                      .name ||
                                    "Author"
                                  }
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-emerald-800">
                                  {getAuthorInitials(
                                    featuredBlog
                                      .author
                                      ?.name
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-slate-900">
                                {featuredBlog
                                  .author
                                  ?.name ||
                                  "AgriNova Expert"}
                              </p>

                              <p className="truncate text-[11px] text-slate-500">
                                {featuredBlog
                                  .author
                                  ?.title ||
                                  "Agricultural Expert"}
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/blog/${
                              featuredBlog.slug ||
                              featuredBlog._id
                            }`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B7A57] px-4 text-xs font-bold text-white transition hover:bg-[#086849]"
                          >
                            Read Article

                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* IMAGE */}

                      <Link
                        href={`/blog/${
                          featuredBlog.slug ||
                          featuredBlog._id
                        }`}
                        className="group relative min-h-[280px] overflow-hidden bg-slate-100 lg:min-h-[390px]"
                      >
                        <Image
                          src={
                            featuredBlog
                              .images?.[0] ||
                            FALLBACK_IMAGE
                          }
                          alt={
                            featuredBlog.title
                          }
                          fill
                          priority
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                        {featuredBlog
                          .images
                          ?.length >
                          1 && (
                          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">
                            <ImageIcon className="h-3 w-3" />

                            {
                              featuredBlog
                                .images
                                .length
                            }{" "}
                            Photos
                          </span>
                        )}
                      </Link>
                    </div>
                  </article>
                )}

              {/* =================================================
                  ARTICLE GRID HEADER
              ================================================= */}

              <div>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                      {selectedCategory ===
                      "All"
                        ? "More Farming Guides"
                        : `${selectedCategory} Guides`}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Explore practical
                      advice from
                      AgriNova
                      agricultural
                      experts.
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    {
                      blogs.length
                    }{" "}
                    {blogs.length ===
                    1
                      ? "article"
                      : "articles"}
                  </span>
                </div>

                {/* =================================================
                    ARTICLE CARDS
                ================================================= */}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {displayBlogs.map(
                    (
                      blog
                    ) => (
                      <article
                        key={
                          blog._id ||
                          blog.slug
                        }
                        className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {/* IMAGE */}

                        <Link
                          href={`/blog/${
                            blog.slug ||
                            blog._id
                          }`}
                          className="relative aspect-[16/9] overflow-hidden bg-slate-100"
                        >
                          <Image
                            src={
                              blog
                                .images?.[0] ||
                              FALLBACK_IMAGE
                            }
                            alt={
                              blog.title
                            }
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-emerald-700 shadow-sm backdrop-blur">
                            {
                              blog.category
                            }
                          </span>

                          {blog.images
                            ?.length >
                            1 && (
                            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                              <ImageIcon className="h-3 w-3" />

                              {
                                blog.images
                                  .length
                              }{" "}
                              Photos
                            </span>
                          )}
                        </Link>

                        {/* BODY */}

                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-medium text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />

                              {formatDate(
                                blog.createdAt
                              )}
                            </span>

                            <span>
                              •
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-3 w-3" />

                              {
                                blog.readTime
                              }
                            </span>

                            <span>
                              •
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <Eye className="h-3 w-3" />

                              {
                                blog.views ||
                                0
                              }
                            </span>
                          </div>

                          <Link
                            href={`/blog/${
                              blog.slug ||
                              blog._id
                            }`}
                            className="mt-3"
                          >
                            <h4 className="line-clamp-2 text-lg font-extrabold leading-snug text-slate-900 transition group-hover:text-emerald-700">
                              {
                                blog.title
                              }
                            </h4>
                          </Link>

                          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                            {
                              blog.summary
                            }
                          </p>

                          {/* AUTHOR */}

                          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-emerald-100 bg-emerald-50">
                                {blog
                                  .author
                                  ?.avatar ? (
                                  <Image
                                    src={
                                      blog
                                        .author
                                        .avatar
                                    }
                                    alt={
                                      blog
                                        .author
                                        .name ||
                                      "Author"
                                    }
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-emerald-800">
                                    {getAuthorInitials(
                                      blog
                                        .author
                                        ?.name
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-[11px] font-bold text-slate-800">
                                  {blog
                                    .author
                                    ?.name ||
                                    "AgriNova Expert"}
                                </p>

                                <p className="truncate text-[10px] text-slate-400">
                                  {blog
                                    .author
                                    ?.title ||
                                    "Agricultural Specialist"}
                                </p>
                              </div>
                            </div>

                            <Link
                              href={`/blog/${
                                blog.slug ||
                                blog._id
                              }`}
                              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700 transition hover:text-emerald-800"
                            >
                              Read

                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>

                {displayBlogs.length ===
                  0 &&
                  blogs.length >
                    0 && (
                    <div className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                      No additional
                      articles to
                      display.
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}