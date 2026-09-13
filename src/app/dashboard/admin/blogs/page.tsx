"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Trash2,
} from "lucide-react";

import {
  adminBlogService,
} from "@/services/admin.blog.service";

import type {
  IBlog,
} from "@/types/blog";

import type {
  AdminListMeta,
} from "@/services/admin.user.service";

export default function AdminBlogsPage() {
  const [
    blogs,
    setBlogs,
  ] =
    useState<
      IBlog[]
    >([]);

  const [
    meta,
    setMeta,
  ] =
    useState<AdminListMeta>({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
    });

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    status,
    setStatus,
  ] =
    useState<
      | "ALL"
      | "PUBLISHED"
      | "DRAFT"
    >(
      "ALL"
    );

  const [
    searchInput,
    setSearchInput,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    busy,
    setBusy,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const result =
            await adminBlogService.getBlogs(
              {
                page,
                limit: 12,
                search,
                status,
              }
            );

          setBlogs(
            result.data
          );

          setMeta(
            result.meta
          );
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "Unable to load blog articles."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        page,
        search,
        status,
      ]
    );

  useEffect(() => {
    void load();
  }, [load]);

  const toggle =
    async (
      blog:
        IBlog
    ) => {
      try {
        setBusy(
          blog._id
        );

        await adminBlogService.setStatus(
          blog._id,

          blog.status ===
          "PUBLISHED"
            ? "DRAFT"
            : "PUBLISHED"
        );

        await load();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Unable to update article."
        );
      } finally {
        setBusy("");
      }
    };

  const remove =
    async (
      blog:
        IBlog
    ) => {
      if (
        !window.confirm(
          `Remove “${blog.title}”? This cannot be undone.`
        )
      ) {
        return;
      }

      try {
        setBusy(
          blog._id
        );

        await adminBlogService.remove(
          blog._id
        );

        await load();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Unable to remove article."
        );
      } finally {
        setBusy("");
      }
    };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Blog Moderation
        </h1>

        <p className="text-sm text-slate-500">
          Experts create their
          own articles. Admin can
          review, hide/publish,
          or remove any article.
        </p>
      </div>

      <form
        onSubmit={(
          e
        ) => {
          e.preventDefault();

          setPage(1);

          setSearch(
            searchInput.trim()
          );
        }}
        className="grid gap-2 sm:grid-cols-[1fr_200px_auto]"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <input
            value={
              searchInput
            }
            onChange={(
              e
            ) =>
              setSearchInput(
                e.target.value
              )
            }
            placeholder="Search title, author or category"
            className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm"
          />
        </div>

        <select
          value={
            status
          }
          onChange={(
            e
          ) => {
            setStatus(
              e.target
                .value as typeof status
            );

            setPage(1);
          }}
          className="rounded-xl border px-3 text-sm"
        >
          <option value="ALL">
            All statuses
          </option>

          <option value="PUBLISHED">
            Published
          </option>

          <option value="DRAFT">
            Hidden / Draft
          </option>
        </select>

        <button className="rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white">
          Search
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-slate-400">
          Loading articles...
        </div>
      ) : blogs.length ===
        0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-slate-400">
          No articles found.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map(
            (
              blog
            ) => (
              <article
                key={
                  blog._id
                }
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                {blog.images?.[0] && (
                  <img
                    src={
                      blog.images[0]
                    }
                    alt={
                      blog.title
                    }
                    className="h-44 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        blog.status ===
                        "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {
                        blog.status
                      }
                    </span>

                    <span className="text-xs text-slate-400">
                      {blog.views ||
                        0}{" "}
                      views
                    </span>
                  </div>

                  <h2 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900">
                    {blog.title}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {blog.author
                      ?.name ||
                      "Expert"}{" "}
                    ·{" "}
                    {
                      blog.category
                    }
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                    {
                      blog.summary
                    }
                  </p>

                  <div className="mt-5 flex gap-2">
                    <button
                      disabled={
                        busy ===
                        blog._id
                      }
                      onClick={() =>
                        void toggle(
                          blog
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold disabled:opacity-50"
                    >
                      {blog.status ===
                      "PUBLISHED" ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Publish
                        </>
                      )}
                    </button>

                    <button
                      disabled={
                        busy ===
                        blog._id
                      }
                      onClick={() =>
                        void remove(
                          blog
                        )
                      }
                      className="rounded-xl border border-red-200 px-3 py-2 text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {meta.total} articles
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={
              page <= 1 ||
              loading
            }
            onClick={() =>
              setPage(
                (
                  p
                ) =>
                  Math.max(
                    1,
                    p - 1
                  )
              )
            }
            className="rounded-lg border p-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span>
            Page {meta.page} of{" "}
            {
              meta.totalPages
            }
          </span>

          <button
            disabled={
              page >=
                meta.totalPages ||
              loading
            }
            onClick={() =>
              setPage(
                (
                  p
                ) =>
                  p + 1
              )
            }
            className="rounded-lg border p-2 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}