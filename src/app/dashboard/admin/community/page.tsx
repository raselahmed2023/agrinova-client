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

  const closeModeration =
    () => {
      if (
        submitting
      ) {
        return;
      }

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

        closeModeration();

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
    <main className="space-y-5">

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              <ShieldAlert className="h-3.5 w-3.5" />
              Community Moderation
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Review Community Posts
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review every Community post, warn a farmer, or remove content that violates AgriNova Community rules.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[280px]">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
                Results
              </p>

              <p className="mt-1 text-xl font-black text-slate-900">
                {total}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-[8px] font-black uppercase tracking-wide text-emerald-600">
                Active on page
              </p>

              <p className="mt-1 text-xl font-black text-emerald-800">
                {activeCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

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
                  className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                    status ===
                    item
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

          <div className="relative w-full lg:max-w-md">
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
              placeholder="Search farmer name or post content..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-[24px] border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </div>
      ) : posts.length ===
        0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <MessageSquareWarning className="mx-auto h-9 w-9 text-slate-300" />

          <p className="mt-3 font-black text-slate-800">
            No Community posts found
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {posts.map(
            (
              post
            ) => {
              const mediaVisible =
                revealedPosts.has(
                  post._id
                );

              return (
                <article
                  key={
                    post._id
                  }
                  className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
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
                        <p className="truncate text-sm font-black text-slate-900">
                          {post.authorName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {formatDate(
                            post.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
                        post.status ===
                        "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {post.content}
                    </p>

                    {post.images?.length >
                      0 && (
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {post.images.length} image
                            {post.images.length >
                            1
                              ? "s"
                              : ""}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              toggleMedia(
                                post._id
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600 hover:bg-slate-200"
                          >
                            {mediaVisible ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}

                            {mediaVisible
                              ? "Hide media"
                              : "Reveal media"}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
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
                                  className={`h-full w-full object-cover transition ${
                                    mediaVisible
                                      ? ""
                                      : "blur-xl scale-110"
                                  }`}
                                />

                                {!mediaVisible && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black text-slate-700">
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
                      <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
                        <p className="text-[9px] font-black uppercase tracking-wide text-red-500">
                          Removal reason
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-700">
                          {post.moderationReason ||
                            "No reason recorded."}
                        </p>

                        {post.removedAt && (
                          <p className="mt-1 text-[9px] text-red-400">
                            Removed{" "}
                            {formatDate(
                              post.removedAt
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <p className="text-[10px] text-slate-400">
                        {post.likeCount ||
                          0}{" "}
                        likes •{" "}
                        {post.commentCount ||
                          0}{" "}
                        comments
                      </p>

                      {post.status ===
                        "ACTIVE" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openModeration(
                                post,
                                "WARN"
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-black text-amber-800 transition hover:bg-amber-100"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Warn
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openModeration(
                                post,
                                "REMOVE"
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-[10px] font-black text-white transition hover:bg-red-700"
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

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
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
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-xs font-bold text-slate-500">
          Page {page} of{" "}
          {totalPages}
        </span>

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
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {selectedPost &&
        action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
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

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {selectedPost.authorName}
                </h2>
              </div>

              <button
                type="button"
                disabled={
                  submitting
                }
                onClick={
                  closeModeration
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="line-clamp-3 text-xs leading-5 text-slate-600">
                  {selectedPost.content}
                </p>
              </div>

              <label className="mt-4 block text-xs font-black text-slate-700">
                Reason
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
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
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
                  placeholder="Enter a short reason..."
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              )}

              <div
                className={`mt-4 rounded-xl border p-3 text-xs leading-5 ${
                  action ===
                  "REMOVE"
                    ? "border-red-100 bg-red-50 text-red-700"
                    : "border-amber-100 bg-amber-50 text-amber-800"
                }`}
              >
                {action ===
                "REMOVE"
                  ? "The post will disappear from the public Community feed. The farmer will receive a notification with this reason."
                  : "The post will stay visible, but the farmer will receive a warning notification."}
              </div>

              <button
                type="button"
                disabled={
                  submitting
                }
                onClick={() =>
                  void submitModeration()
                }
                className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white disabled:opacity-50 ${
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
                    ? "Remove Post & Notify Farmer"
                    : "Send Warning"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          void load()
        }
        className="fixed bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg transition hover:bg-emerald-800"
        aria-label="Refresh Community moderation"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </main>
  );
}
