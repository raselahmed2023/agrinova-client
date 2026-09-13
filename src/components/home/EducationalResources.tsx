"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";

import { apiRequest } from "@/services/api.client";
import type { IBlog } from "@/types/blog";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export default function EducationalResources() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadLatestBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams({
          status: "PUBLISHED",
          page: "1",
          limit: "3",
          sortBy: "createdAt",
          sortOrder: "desc",
        }).toString();

        const data = await apiRequest<IBlog[]>(
          "/blogs",
          "GET",
          undefined,
          query,
        );

        if (!active) return;

        setBlogs(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error(
          "Failed to load latest farming guides:",
          err,
        );

        if (!active) return;

        setBlogs([]);
        setError(
          "Latest farming guides are temporarily unavailable.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLatestBlogs();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F8FAF8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-emerald-200/20 blur-[110px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-200/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-emerald-700" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700 sm:text-[11px]">
                Agronomic Knowledge
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-[-0.035em] text-[#103F32] sm:text-4xl lg:text-[44px]">
              Latest Farming Guides
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Explore the latest published farming guides,
              agricultural insights, and practical advice from
              AgriNova experts.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-900"
          >
            Browse Knowledge Base

            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[20px] border border-slate-200 bg-white"
              >
                <div className="h-[220px] animate-pulse bg-slate-200 sm:h-[235px]" />

                <div className="p-6">
                  <div className="h-5 w-28 animate-pulse rounded-full bg-slate-100" />

                  <div className="mt-5 h-6 w-[85%] animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />

                  <div className="mt-2 h-4 w-[70%] animate-pulse rounded bg-slate-100" />

                  <div className="mt-8 h-px bg-slate-100" />

                  <div className="mt-4 h-4 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* API Error — no fake fallback */}
        {!loading && error && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              Guides unavailable
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <Link
              href="/blog"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900"
            >
              Visit Blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* No published blogs */}
        {!loading && !error && blogs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              No published guides yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Published farming guides will appear here automatically.
            </p>
          </div>
        )}

        {/* Real blog cards */}
        {!loading && !error && blogs.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog, index) => {
              const href = `/blog/${blog.slug || blog._id}`;

              const image =
                blog.images?.[0] ||
                "/images/marketplace-bg.jpg";

              return (
                <motion.article
                  key={blog._id}
                  variants={cardVariants}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.01,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:border-emerald-200 hover:shadow-[0_22px_55px_rgba(15,61,48,0.12)]"
                >
                  {/* Real blog cover */}
                  <Link
                    href={href}
                    className="relative block h-[220px] overflow-hidden bg-slate-100 sm:h-[235px]"
                  >
                    <Image
                      src={image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                  </Link>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* Category + read time */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="max-w-[70%] truncate rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                        {blog.category}
                      </span>

                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock className="h-3 w-3" />

                        {blog.readTime || "5 min read"}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={href}>
                      <h3 className="mt-4 line-clamp-2 text-lg font-extrabold leading-6 tracking-[-0.02em] text-[#172C25] transition-colors duration-200 group-hover:text-emerald-700 sm:text-xl">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Real summary */}
                    <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-slate-500 sm:text-sm">
                      {blog.summary}
                    </p>

                    {/* Date */}
                    <p className="mt-4 text-[10px] font-medium text-slate-400">
                      {new Date(
                        blog.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto pt-5">
                      <div className="h-px w-full bg-slate-100 transition-colors duration-300 group-hover:bg-emerald-100" />

                      <Link
                        href={href}
                        className="group/link mt-4 flex items-center justify-between text-xs font-bold text-[#174D3C]"
                      >
                        <span>Read Guide</span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full transition duration-200 group-hover/link:bg-emerald-50">
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Hover bottom line */}
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-emerald-500 transition-all duration-500 group-hover:w-full" />
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}