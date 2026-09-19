"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  MessageSquareWarning,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import {
  getAdminCommunityPosts,
  removeCommunityPostByAdmin,
  warnCommunityFarmerByAdmin,
} from "@/services/community.service";

import type {
  CommunityPost,
} from "@/types/community";

type StatusFilter =
  | "ALL"
  | "ACTIVE"
  | "REMOVED";

type ModerationAction =
  | "REMOVE"
  | "WARN";

const REASONS = [
  "Nudity or sexual content",
  "Harassment, hateful or abusive content",
  "Spam or misleading content",
  "Violence or disturbing content",
  "Off-topic or inappropriate Community content",
  "Other policy violation",
];

function formatDate(
  value?: string
) {
  if (!value) {
    return "Unknown";
  }

  return new Date(
    value
  ).toLocaleString();
}

function initials(
  name?: string
) {
  if (!name) {
    return "F";
  }

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (part) =>
        part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminCommunityModerationPage() {
  const [
    posts,
    setPosts,
  ] =
    useState<
      CommunityPost[]
    >([]);

  const [
    status,
    setStatus,
  ] =
    useState<StatusFilter>(
      "ALL"
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] =
    useState("");

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    totalPages,
    setTotalPages,
  ] =
    useState(1);

  const [
    total,
    setTotal,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    selectedPost,
    setSelectedPost,
  ] =
    useState<
      CommunityPost | null
    >(null);

  const [
    action,
    setAction,
  ] =
    useState<
      ModerationAction | null
    >(null);

  const [
    reason,
    setReason,
  ] =
    useState("");

  const [
    customReason,
    setCustomReason,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    revealedPosts,
    setRevealedPosts,
  ] =
    useState<
      Set<string>
    >(
      () =>
        new Set()
    );

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            search.trim()
          );

          setPage(
            1
          );
        },
        350
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    search,
  ]);

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

          const result =
            await getAdminCommunityPosts(
              status,
              debouncedSearch,
              page
            );

          setPosts(
            Array.isArray(
              result.posts
            )
              ? result.posts
              : []
          );

          setTotal(
            Number(
              result.meta
                ?.total ||
                0
            )
          );

          setTotalPages(
            Math.max(
              Number(
                result.meta
                  ?.totalPages ||
                  1
              ),
              1
            )
          );
        } catch (
          err
        ) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Community posts."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        status,
        debouncedSearch,
        page,
      ]
    );

  useEffect(() => {
    void load();
  }, [
    load,
  ]);

  const activeCount =
    useMemo(
      () =>
        posts.filter(
          (
            post
          ) =>
            post.status ===
            "ACTIVE"
        ).length,
      [
        posts,
      ]
    );

  const openModeration =
    (
      post:
        CommunityPost,
      nextAction:
        ModerationAction
    ) => {
      setSelectedPost(
        post
      );

      setAction(
        nextAction
      );

      setReason(
        REASONS[0]
      );

      setCustomReason(
        ""
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );
    };

  const resetModerationState =
    () => {
      setSelectedPost(
        null
      );

      setAction(
        null
      );

      setReason(
        ""
      );

      setCustomReason(
        ""
      );
    };

  const closeModeration =
    () => {
      if (
        submitting
      ) {
        return;
      }

      resetModerationState();
    };

  const submitModeration =
    async () => {
      if (
        !selectedPost ||
        !action ||
        submitting
      ) {
        return;
      }

      const finalReason =
        (
          reason ===
          "Other policy violation"
            ? customReason
            : reason
        ).trim();

      if (
        finalReason.length <
        5
      ) {
        setError(
          "Please enter a clear reason of at least 5 characters."
        );

        return;
      }

      try {
        setSubmitting(
          true
        );

        setError(
          ""
        );

        if (
          action ===
          "REMOVE"
        ) {
          const updated =
            await removeCommunityPostByAdmin(
              selectedPost._id,
              finalReason
            );

          setPosts(
            (
              current
            ) =>
              current.map(
                (
                  post
                ) =>
                  post._id ===
                  updated._id
                    ? updated
                    : post
              )
          );

          setSuccess(
            "Post removed. The farmer received a notification with the reason."
          );
        } else {
          await warnCommunityFarmerByAdmin(
            selectedPost._id,
            finalReason
          );

          setSuccess(
            "Warning sent to the farmer's notifications."
          );
        }

        resetModerationState();

        void load();
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Moderation action failed."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  const toggleMedia =
    (
      postId:
        string
    ) => {
      setRevealedPosts(
        (
          current
        ) => {
          const next =
            new Set(
              current
            );

          if (
            next.has(
              postId
            )
          ) {
            next.delete(
              postId
            );
          } else {
            next.add(
              postId
            );
          }

          return next;
        }
      );
    };

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 pb-10">
      {/* HERO */}
      <section className="overflow-hidden rounded-[30px] border border-emerald-950/10 bg-[linear-gradient(135deg,#062f24_0%,#0b5d42_55%,#11775a_100%)] shadow-[0_24px_80px_rgba(6,47,36,0.20)]">
        <div className="relative px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100 backdrop-blur">
                <ShieldAlert className="h-3.5 w-3.5" />
                Community Moderation
              </div>

              <h1 className="mt-4 max-w-3xl text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[34px]">
                Keep AgriNova Community safe and useful
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/75 sm:text-[15px]">
                Review farmer posts, inspect media safely, issue warnings, and remove content when it violates Community rules.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[330px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/70">
                  Matching Posts
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {total}
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-100/70">
                  Active This Page
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {activeCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL BAR */}
      <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                "ALL",
                "ACTIVE",
                "REMOVED",
              ] as StatusFilter[]
            ).map(
              (
                item
              ) => (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() => {
                    setStatus(
                      item
                    );

                    setPage(
                      1
                    );
                  }}
                  className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                    status ===
                    item
                      ? "bg-slate-950 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  {item ===
                  "ALL"
                    ? "All Posts"
                    : item ===
                        "ACTIVE"
                      ? "Active"
                      : "Removed"}
                </button>
              )
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:min-w-[520px]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search farmer or post content..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                void load()
              }
              disabled={
                loading
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-900 shadow-sm">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <span>
            {success}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-800 shadow-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <span>
            {error}
          </span>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-[26px] border border-slate-200 bg-white shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
            <p className="mt-3 text-sm font-bold text-slate-500">
              Loading moderation queue...
            </p>
          </div>
        </div>
      ) : posts.length ===
        0 ? (
        <div className="rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <MessageSquareWarning className="h-6 w-6 text-slate-400" />
          </div>

          <p className="mt-4 text-base font-black text-slate-900">
            No Community posts found
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Try a different status filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {posts.map(
            (
              post
            ) => {
              const mediaVisible =
                revealedPosts.has(
                  post._id
                );

              const isActive =
                post.status ===
                "ACTIVE";

              return (
                <article
                  key={
                    post._id
                  }
                  className="group overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xs font-black text-emerald-800 ring-4 ring-white shadow-sm">
                        {post.authorAvatar ? (
                          <img
                            src={
                              post.authorAvatar
                            }
                            alt={
                              post.authorName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials(
                            post.authorName
                          )
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">
                          {post.authorName}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-slate-400">
                          {formatDate(
                            post.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-red-50 text-red-700 ring-1 ring-red-100"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {post.content}
                    </p>

                    {post.images?.length >
                      0 && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2.5">
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {post.images.length} attached
                            {post.images.length >
                            1
                              ? " images"
                              : " image"}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              toggleMedia(
                                post._id
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-black text-slate-600 transition hover:bg-slate-100"
                          >
                            {mediaVisible ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}

                            {mediaVisible
                              ? "Hide"
                              : "Reveal"}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-2">
                          {post.images.map(
                            (
                              image,
                              index
                            ) => (
                              <div
                                key={`${image}-${index}`}
                                className="relative aspect-video overflow-hidden rounded-xl bg-slate-100"
                              >
                                <img
                                  src={
                                    image
                                  }
                                  alt="Community moderation media"
                                  className={`h-full w-full object-cover transition duration-300 ${
                                    mediaVisible
                                      ? ""
                                      : "scale-110 blur-xl"
                                  }`}
                                />

                                {!mediaVisible && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25">
                                    <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[9px] font-black text-slate-700 shadow-sm">
                                      Media hidden
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {post.status ===
                      "REMOVED" && (
                      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/70 p-3.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-red-500">
                          Removal Reason
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-red-800">
                          {post.moderationReason ||
                            "No reason recorded."}
                        </p>

                        {post.removedAt && (
                          <p className="mt-2 text-[9px] font-medium text-red-400">
                            Removed{" "}
                            {formatDate(
                              post.removedAt
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[10px] font-semibold text-slate-400">
                        {post.likeCount ||
                          0}{" "}
                        likes
                        <span className="mx-1.5">
                          •
                        </span>
                        {post.commentCount ||
                          0}{" "}
                        comments
                      </p>

                      {isActive && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openModeration(
                                post,
                                "WARN"
                              )
                            }
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[10px] font-black text-amber-800 transition hover:bg-amber-100 sm:flex-none"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Warn Farmer
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openModeration(
                                post,
                                "REMOVE"
                              )
                            }
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2.5 text-[10px] font-black text-white shadow-sm transition hover:bg-red-700 sm:flex-none"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}

      {/* PAGINATION */}
      <section className="flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold text-slate-500">
          Page {page} of {totalPages}
          <span className="mx-2 text-slate-300">
            •
          </span>
          {total} total result
          {total ===
          1
            ? ""
            : "s"}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={
              page <=
                1 ||
              loading
            }
            onClick={() =>
              setPage(
                (
                  current
                ) =>
                  Math.max(
                    current -
                      1,
                    1
                  )
              )
            }
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              page >=
                totalPages ||
              loading
            }
            onClick={() =>
              setPage(
                (
                  current
                ) =>
                  Math.min(
                    current +
                      1,
                    totalPages
                  )
              )
            }
            className="flex-1 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
          >
            Next
          </button>
        </div>
      </section>

      {/* MODERATION MODAL */}
      {selectedPost &&
        action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.30)]">
            <div
              className={`border-b px-5 py-5 sm:px-6 ${
                action ===
                "REMOVE"
                  ? "border-red-100 bg-gradient-to-r from-red-50 to-white"
                  : "border-amber-100 bg-gradient-to-r from-amber-50 to-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      action ===
                      "REMOVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {action ===
                    "REMOVE" ? (
                      <Trash2 className="h-5 w-5" />
                    ) : (
                      <MessageSquareWarning className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.16em] ${
                        action ===
                        "REMOVE"
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {action ===
                      "REMOVE"
                        ? "Remove Community Post"
                        : "Send Community Warning"}
                    </p>

                    <h2 className="mt-1 truncate text-xl font-black text-slate-950">
                      {selectedPost.authorName}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={
                    submitting
                  }
                  onClick={
                    closeModeration
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
                  aria-label="Close moderation dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Post preview
                </p>

                <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-650">
                  {selectedPost.content}
                </p>
              </div>

              <label className="mt-5 block text-xs font-black text-slate-700">
                Moderation reason
              </label>

              <select
                value={
                  reason
                }
                onChange={(
                  event
                ) =>
                  setReason(
                    event.target.value
                  )
                }
                disabled={
                  submitting
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              >
                {REASONS.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              {reason ===
                "Other policy violation" && (
                <textarea
                  rows={
                    3
                  }
                  value={
                    customReason
                  }
                  onChange={(
                    event
                  ) =>
                    setCustomReason(
                      event.target.value
                    )
                  }
                  disabled={
                    submitting
                  }
                  maxLength={
                    500
                  }
                  placeholder="Enter a clear moderation reason..."
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                />
              )}

              <div
                className={`mt-4 rounded-2xl border p-3.5 text-xs leading-5 ${
                  action ===
                  "REMOVE"
                    ? "border-red-100 bg-red-50 text-red-800"
                    : "border-amber-100 bg-amber-50 text-amber-800"
                }`}
              >
                {action ===
                "REMOVE"
                  ? "This post will be removed from the public Community feed and the farmer will receive the selected reason."
                  : "The post will remain visible, but the farmer will receive a warning notification with this reason."}
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={
                    submitting
                  }
                  onClick={
                    closeModeration
                  }
                  className="order-2 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:order-1"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    submitting
                  }
                  onClick={() =>
                    void submitModeration()
                  }
                  className={`order-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 ${
                    action ===
                    "REMOVE"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : action ===
                    "REMOVE" ? (
                    <Trash2 className="h-4 w-4" />
                  ) : (
                    <MessageSquareWarning className="h-4 w-4" />
                  )}

                  {submitting
                    ? "Processing..."
                    : action ===
                        "REMOVE"
                      ? "Remove & Notify"
                      : "Send Warning"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
