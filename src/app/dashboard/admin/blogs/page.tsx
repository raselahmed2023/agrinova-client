"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Edit3,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createBlog,
  deleteBlog,
  getMyBlogs,
  updateBlog,
  uploadBlogImage,
} from "@/services/blog.service";

import type {
  IBlog,
  IBlogFormData,
} from "@/types/blog";

const createBlankForm =
  (): IBlogFormData => ({
    title: "",

    category:
      "Crop Management",

    tags: [],

    summary: "",

    content: "",

    images: [],

    status:
      "PUBLISHED",
  });

export default function ExpertBlogsPage() {
  const [
    blogs,
    setBlogs,
  ] =
    useState<
      IBlog[]
    >([]);

  const [
    form,
    setForm,
  ] =
    useState<
      IBlogFormData
    >(
      createBlankForm()
    );

  const [
    editingId,
    setEditingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    tagText,
    setTagText,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  /* ============================================================
     LOAD EXPERT'S OWN BLOGS
  ============================================================ */

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const data =
            await getMyBlogs();

          setBlogs(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          err
        ) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your articles."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void load();
  }, [load]);

  /* ============================================================
     RESET
  ============================================================ */

  const resetForm =
    () => {
      setForm(
        createBlankForm()
      );

      setTagText(
        ""
      );

      setEditingId(
        null
      );
    };

  /* ============================================================
     EDIT
  ============================================================ */

  const edit =
    (
      blog: IBlog
    ) => {
      setEditingId(
        blog._id
      );

      setForm({
        title:
          blog.title,

        category:
          blog.category,

        tags:
          blog.tags ||
          [],

        summary:
          blog.summary,

        content:
          blog.content,

        images:
          blog.images ||
          [],

        status:
          blog.status,
      });

      setTagText(
        (
          blog.tags ||
          []
        ).join(", ")
      );

      setError(
        ""
      );

      setMessage(
        ""
      );

      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    };

  /* ============================================================
     IMAGE UPLOAD
  ============================================================ */

  const uploadCover =
    async (
      file?: File
    ) => {
      if (!file) {
        return;
      }

      try {
        setUploading(
          true
        );

        setError(
          ""
        );

        const url =
          await uploadBlogImage(
            file
          );

        setForm(
          (
            current
          ) => ({
            ...current,

            images: [
              url,
            ],
          })
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to upload cover image."
        );
      } finally {
        setUploading(
          false
        );
      }
    };

  /* ============================================================
     SAVE
  ============================================================ */

  const submit =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (
        !form.images?.[0]
      ) {
        setError(
          "Please upload a cover image."
        );

        return;
      }

      const tags =
        tagText
          .split(",")
          .map(
            (
              tag
            ) =>
              tag.trim()
          )
          .filter(
            Boolean
          )
          .slice(
            0,
            8
          );

      const payload:
        IBlogFormData =
        {
          ...form,

          tags,
        };

      try {
        setSaving(
          true
        );

        setError(
          ""
        );

        setMessage(
          ""
        );

        if (editingId) {
          await updateBlog(
            editingId,
            payload
          );

          setMessage(
            "Article updated successfully."
          );
        } else {
          await createBlog(
            payload
          );

          setMessage(
            payload.status ===
            "DRAFT"
              ? "Draft saved successfully."
              : "Article published successfully."
          );
        }

        resetForm();

        await load();
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to save article."
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  /* ============================================================
     DELETE
  ============================================================ */

  const remove =
    async (
      id: string
    ) => {
      const confirmed =
        window.confirm(
          "Delete this article? This action cannot be undone."
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        setDeletingId(
          id
        );

        setError(
          ""
        );

        await deleteBlog(
          id
        );

        setMessage(
          "Article deleted successfully."
        );

        if (
          editingId ===
          id
        ) {
          resetForm();
        }

        await load();
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete article."
        );
      } finally {
        setDeletingId(
          ""
        );
      }
    };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">

      {/* Header */}

      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-800 p-7 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
          Expert Publishing
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Agricultural Blog Studio
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50/90">
          Only Expert accounts can create,
          edit or delete AgriNova articles.
          The publishing form is intentionally
          simple and focused.
        </p>
      </section>

      {/* Messages */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {
            error
          }
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
          {
            message
          }
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_.85fr]">

        {/* Editor */}

        <form
          onSubmit={
            submit
          }
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                {editingId
                  ? "Edit article"
                  : "Write article"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep the article practical,
                focused and easy to understand.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  resetForm();

                  setError(
                    ""
                  );

                  setMessage(
                    ""
                  );
                }}
                aria-label="Cancel editing"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid gap-5">

            {/* Title */}

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">
                Title
              </span>

              <input
                value={
                  form.title
                }
                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    title:
                      event
                        .target
                        .value,
                  })
                }
                required
                maxLength={
                  180
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="A clear farming topic"
              />
            </label>

            {/* Category/status */}

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">
                  Category
                </span>

                <input
                  value={
                    form.category
                  }
                  onChange={(
                    event
                  ) =>
                    setForm({
                      ...form,

                      category:
                        event
                          .target
                          .value,
                    })
                  }
                  required
                  maxLength={
                    80
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Soil Health"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">
                  Status
                </span>

                <select
                  value={
                    form.status
                  }
                  onChange={(
                    event
                  ) =>
                    setForm({
                      ...form,

                      status:
                        event
                          .target
                          .value as
                          | "PUBLISHED"
                          | "DRAFT",
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="PUBLISHED">
                    Publish
                  </option>

                  <option value="DRAFT">
                    Save draft
                  </option>
                </select>
              </label>
            </div>

            {/* Summary */}

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">
                Short summary
              </span>

              <textarea
                value={
                  form.summary
                }
                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    summary:
                      event
                        .target
                        .value,
                  })
                }
                required
                rows={
                  3
                }
                maxLength={
                  500
                }
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="What will readers learn?"
              />
            </label>

            {/* Tags */}

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">
                Tags{" "}
                <span className="font-normal text-slate-400">
                  optional
                </span>
              </span>

              <input
                value={
                  tagText
                }
                onChange={(
                  event
                ) =>
                  setTagText(
                    event
                      .target
                      .value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="rice, irrigation, pest management"
              />
            </label>

            {/* Image */}

            <div className="space-y-2">
              <span className="text-sm font-bold text-slate-700">
                Cover image
              </span>

              <label className="flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50/40">

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={
                    uploading
                  }
                  onChange={(
                    event
                  ) =>
                    void uploadCover(
                      event
                        .target
                        .files?.[0]
                    )
                  }
                />

                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5 text-emerald-700" />

                    Choose cover image
                  </>
                )}
              </label>

              {form.images?.[0] && (
                <img
                  src={
                    form.images[0]
                  }
                  alt="Cover preview"
                  className="h-52 w-full rounded-2xl object-cover"
                />
              )}
            </div>

            {/* Article */}

            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">
                Article
              </span>

              <textarea
                value={
                  form.content
                }
                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    content:
                      event
                        .target
                        .value,
                  })
                }
                required
                rows={
                  14
                }
                maxLength={
                  30000
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-sans leading-7 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                placeholder="Write the article here. Simple Markdown headings and lists are supported."
              />
            </label>
          </div>

          <button
            disabled={
              saving ||
              uploading
            }
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : editingId ? (
              <>
                <Edit3 className="h-4 w-4" />

                Update article
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />

                {form.status ===
                "DRAFT"
                  ? "Save draft"
                  : "Publish article"}
              </>
            )}
          </button>
        </form>

        {/* Articles */}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Your articles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              You can edit or delete only articles
              authored by your Expert account.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
            </div>
          ) : blogs.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              No articles yet.
            </div>
          ) : (
            blogs.map(
              (
                blog
              ) => (
                <article
                  key={
                    blog._id
                  }
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  {blog.images?.[0] && (
                    <img
                      src={
                        blog
                          .images[0]
                      }
                      alt={
                        blog.title
                      }
                      className="h-44 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {
                          blog.status
                        }
                      </span>

                      <span className="text-xs text-slate-400">
                        {
                          blog.readTime
                        }
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-black text-slate-950">
                      {
                        blog.title
                      }
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {
                        blog.summary
                      }
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          edit(
                            blog
                          )
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit3 className="h-4 w-4" />

                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          blog._id
                        }
                        onClick={() =>
                          void remove(
                            blog._id
                          )
                        }
                        aria-label="Delete article"
                        className="inline-flex min-w-12 items-center justify-center rounded-xl border border-red-200 px-4 py-2.5 text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId ===
                        blog._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              )
            )
          )}
        </section>
      </div>
    </div>
  );
}