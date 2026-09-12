"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Heart,
  Loader2,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Reply,
  Send,
  Trash2,
} from "lucide-react";

import type {
  CommunityComment,
  CommunityPost,
  CommunityReply,
} from "@/types/community";

import {
  addCommunityComment,
  addCommunityReply,
  deleteCommunityPost,
  toggleCommunityLike,
  updateCommunityPost,
} from "@/services/community.service";

function initials(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (
        part: string
      ) =>
        part[0]
    )
    .join("")
    .slice(
      0,
      2
    )
    .toUpperCase();
}

function timeAgo(
  value: string
) {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const ms =
    Date.now() -
    date.getTime();

  const minutes =
    Math.floor(
      ms / 60000
    );

  if (
    minutes < 1
  ) {
    return "Just now";
  }

  if (
    minutes < 60
  ) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (
    hours < 24
  ) {
    return `${hours}h`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (
    days < 7
  ) {
    return `${days}d`;
  }

  return date.toLocaleDateString();
}

interface CommunityPostCardProps {
  initialPost:
    CommunityPost;

  currentUserId?:
    string;

  currentUserRole?:
    string | null;

  onDeleted?: (
    postId: string
  ) => void;
}

export default function CommunityPostCard({
  initialPost,
  currentUserId,
  currentUserRole,
  onDeleted,
}: CommunityPostCardProps) {
  const router =
    useRouter();

  const isAuthenticated =
    Boolean(
      currentUserId
    );

  const isFarmer =
    String(
      currentUserRole ||
        ""
    ).toUpperCase() ===
    "FARMER";

  const [
    post,
    setPost,
  ] =
    useState<
      CommunityPost
    >(() => ({
      ...initialPost,

      likedByMe:
        initialPost.likedByMe ||
        Boolean(
          currentUserId &&
            initialPost.likes?.some(
              (
                id: string
              ) =>
                String(
                  id
                ) ===
                String(
                  currentUserId
                )
            )
        ),
    }));

  const [
    comment,
    setComment,
  ] =
    useState("");

  const [
    replyingTo,
    setReplyingTo,
  ] =
    useState<
      string | null
    >(null);

  const [
    replyText,
    setReplyText,
  ] =
    useState("");

  const [
    editing,
    setEditing,
  ] =
    useState(false);

  const [
    editText,
    setEditText,
  ] =
    useState(
      post.content
    );

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const mine =
    Boolean(
      isFarmer &&
        currentUserId &&
        String(
          currentUserId
        ) ===
          String(
            post.authorId
          )
    );

  /* ============================================================
     LOGIN
  ============================================================ */

  const login =
    () => {
      router.push(
        `/login?redirect=${encodeURIComponent(
          "/community"
        )}`
      );
    };

  /* ============================================================
     FARMER ACTION CHECK
  ============================================================ */

  const requireFarmer =
    () => {
      if (
        !isAuthenticated
      ) {
        login();

        return false;
      }

      if (
        !isFarmer
      ) {
        return false;
      }

      return true;
    };

  /* ============================================================
     PROFILE CLICK

     Anonymous user:
     -> Login

     Farmer:
     -> Community profile

     Other authenticated roles:
     -> remain in Community
  ============================================================ */

  const openProfile =
    (
      authorId:
        string
    ) => {
      if (
        !isAuthenticated
      ) {
        router.push(
          `/login?redirect=${encodeURIComponent(
            `/community/profile/${authorId}`
          )}`
        );

        return;
      }

      if (
        !isFarmer
      ) {
        return;
      }

      router.push(
        `/community/profile/${authorId}`
      );
    };

  /* ============================================================
     LIKE
  ============================================================ */

  const refreshLike =
    async () => {
      if (
        !requireFarmer() ||
        busy
      ) {
        return;
      }

      try {
        setBusy(
          true
        );

        setError(
          ""
        );

        const updated =
          await toggleCommunityLike(
            post._id
          );

        setPost(
          updated
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update like."
        );
      } finally {
        setBusy(
          false
        );
      }
    };

  /* ============================================================
     COMMENT BUTTON
  ============================================================ */

  const focusComment =
    () => {
      if (
        !requireFarmer()
      ) {
        return;
      }

      document
        .getElementById(
          `comment-${post._id}`
        )
        ?.focus();
    };

  /* ============================================================
     COMMENT
  ============================================================ */

  const submitComment =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      const content =
        comment.trim();

      if (
        !requireFarmer() ||
        !content ||
        busy
      ) {
        return;
      }

      try {
        setBusy(
          true
        );

        setError(
          ""
        );

        const created =
          await addCommunityComment(
            post._id,
            content
          );

        setPost(
          (
            current
          ) => ({
            ...current,

            comments: [
              ...(current.comments ||
                []),

              created,
            ],

            commentCount:
              Number(
                current.commentCount ||
                  0
              ) + 1,
          })
        );

        setComment(
          ""
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to add comment."
        );
      } finally {
        setBusy(
          false
        );
      }
    };

  /* ============================================================
     OPEN REPLY
  ============================================================ */

  const toggleReply =
    (
      commentId:
        string
    ) => {
      if (
        !requireFarmer()
      ) {
        return;
      }

      setReplyingTo(
        (
          current
        ) =>
          current ===
          commentId
            ? null
            : commentId
      );

      setReplyText(
        ""
      );
    };

  /* ============================================================
     REPLY
  ============================================================ */

  const submitReply =
    async (
      commentId:
        string
    ) => {
      const content =
        replyText.trim();

      if (
        !requireFarmer() ||
        !content ||
        busy
      ) {
        return;
      }

      try {
        setBusy(
          true
        );

        setError(
          ""
        );

        const created =
          await addCommunityReply(
            post._id,
            commentId,
            content
          );

        setPost(
          (
            current
          ) => ({
            ...current,

            comments:
              current.comments.map(
                (
                  item:
                    CommunityComment
                ) =>
                  item._id ===
                  commentId
                    ? {
                        ...item,

                        replies: [
                          ...(item.replies ||
                            []),

                          created,
                        ],
                      }
                    : item
              ),
          })
        );

        setReplyText(
          ""
        );

        setReplyingTo(
          null
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to add reply."
        );
      } finally {
        setBusy(
          false
        );
      }
    };

  /* ============================================================
     UPDATE OWN POST
  ============================================================ */

  const saveEdit =
    async () => {
      const content =
        editText.trim();

      if (
        !mine ||
        !content ||
        busy
      ) {
        return;
      }

      try {
        setBusy(
          true
        );

        setError(
          ""
        );

        const updated =
          await updateCommunityPost(
            post._id,
            {
              content,
            }
          );

        setPost(
          updated
        );

        setEditing(
          false
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update post."
        );
      } finally {
        setBusy(
          false
        );
      }
    };

  /* ============================================================
     DELETE OWN POST
  ============================================================ */

  const remove =
    async () => {
      if (
        !mine ||
        busy
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Delete this Community post?"
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        setBusy(
          true
        );

        setError(
          ""
        );

        await deleteCommunityPost(
          post._id
        );

        onDeleted?.(
          post._id
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete post."
        );
      } finally {
        setBusy(
          false
        );
      }
    };

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          AUTHOR / MENU
      ====================================================== */}

      <div className="p-5 sm:p-6">

        <div className="flex items-start justify-between gap-3">

          <button
            type="button"
            onClick={() =>
              openProfile(
                post.authorId
              )
            }
            className="group flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
              {initials(
                post.authorName
              )}
            </div>

            <div className="min-w-0">

              <p className="truncate font-black text-slate-950 transition group-hover:text-emerald-700">
                {
                  post.authorName
                }
              </p>

              <p className="text-xs text-slate-400">
                {timeAgo(
                  post.createdAt
                )}{" "}
                · Farmer Community
              </p>
            </div>
          </button>

          {mine && (
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                aria-label="Post options"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 z-20 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(
                        true
                      );

                      setEditText(
                        post.content
                      );

                      setMenuOpen(
                        false
                      );
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" />

                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(
                        false
                      );

                      void remove();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />

                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            EDIT
        ==================================================== */}

        {editing ? (
          <div className="mt-4 space-y-3">

            <textarea
              value={
                editText
              }
              onChange={(
                event
              ) =>
                setEditText(
                  event.target
                    .value
                )
              }
              maxLength={
                5000
              }
              rows={
                4
              }
              className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-[15px] leading-7 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <div className="flex justify-end gap-2">

              <button
                type="button"
                disabled={
                  busy
                }
                onClick={() => {
                  setEditing(
                    false
                  );

                  setEditText(
                    post.content
                  );
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void saveEdit()
                }
                disabled={
                  busy ||
                  !editText.trim()
                }
                className="flex min-h-10 min-w-20 items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-700">
            {
              post.content
            }
          </p>
        )}
      </div>

      {/* =====================================================
          IMAGES
      ====================================================== */}

      {post.images &&
        post.images.length >
          0 && (
          <div
            className={`grid gap-1 bg-slate-100 ${
              post.images
                .length > 1
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {post.images.map(
              (
                src:
                  string,
                index:
                  number
              ) => (
                <img
                  key={`${src}-${index}`}
                  src={
                    src
                  }
                  alt="Community post"
                  loading="lazy"
                  className="h-full max-h-[520px] min-h-52 w-full object-cover"
                />
              )
            )}
          </div>
        )}

      {/* =====================================================
          COUNTS
      ====================================================== */}

      <div className="px-5 py-3 text-xs font-semibold text-slate-500 sm:px-6">

        <div className="flex items-center justify-between">

          <span>
            {post.likeCount ||
              0}{" "}
            {post.likeCount ===
            1
              ? "like"
              : "likes"}
          </span>

          <span>
            {post.comments
              ?.length ||
              0}{" "}
            {post.comments
              ?.length ===
            1
              ? "comment"
              : "comments"}
          </span>
        </div>
      </div>

      {/* =====================================================
          LIKE + COMMENT BUTTON
      ====================================================== */}

      <div className="grid grid-cols-2 border-y border-slate-100 px-3 py-1">

        <button
          type="button"
          onClick={() =>
            void refreshLike()
          }
          disabled={
            busy &&
            isFarmer
          }
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
            post.likedByMe
              ? "text-rose-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {busy &&
          isFarmer ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 ${
                post.likedByMe
                  ? "fill-current"
                  : ""
              }`}
            />
          )}

          Like
        </button>

        <button
          type="button"
          onClick={
            focusComment
          }
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          <MessageCircle className="h-5 w-5" />

          Comment
        </button>
      </div>

      {/* =====================================================
          COMMENTS
      ====================================================== */}

      <div className="space-y-4 p-5 sm:p-6">

        {post.comments?.map(
          (
            item:
              CommunityComment
          ) => (
            <div
              key={
                item._id
              }
              className="flex gap-3"
            >

              {/* Comment avatar */}

              <button
                type="button"
                onClick={() =>
                  openProfile(
                    item.authorId
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-700 transition hover:bg-emerald-100 hover:text-emerald-800"
              >
                {initials(
                  item.authorName
                )}
              </button>

              <div className="min-w-0 flex-1">

                <div className="inline-block max-w-full rounded-2xl bg-slate-100 px-4 py-2.5">

                  <button
                    type="button"
                    onClick={() =>
                      openProfile(
                        item.authorId
                      )
                    }
                    className="block text-left text-xs font-black text-slate-900 transition hover:text-emerald-700"
                  >
                    {
                      item.authorName
                    }
                  </button>

                  <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {
                      item.content
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleReply(
                      item._id
                    )
                  }
                  className="ml-2 mt-1 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-emerald-700"
                >
                  <Reply className="h-3 w-3" />

                  Reply
                </button>

                {/* ===========================================
                    REPLIES
                ============================================ */}

                {item.replies?.map(
                  (
                    reply:
                      CommunityReply
                  ) => (
                    <div
                      key={
                        reply._id
                      }
                      className="ml-4 mt-3 flex gap-2"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          openProfile(
                            reply.authorId
                          )
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[9px] font-black text-emerald-800 transition hover:bg-emerald-100"
                      >
                        {initials(
                          reply.authorName
                        )}
                      </button>

                      <div className="max-w-full rounded-2xl bg-emerald-50/70 px-3 py-2">

                        <button
                          type="button"
                          onClick={() =>
                            openProfile(
                              reply.authorId
                            )
                          }
                          className="block text-left text-xs font-black text-slate-900 transition hover:text-emerald-700"
                        >
                          {
                            reply.authorName
                          }
                        </button>

                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {
                            reply.content
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}

                {/* ===========================================
                    REPLY INPUT
                ============================================ */}

                {replyingTo ===
                  item._id &&
                  isFarmer && (
                  <div className="mt-2 flex gap-2">

                    <input
                      value={
                        replyText
                      }
                      onChange={(
                        event
                      ) =>
                        setReplyText(
                          event
                            .target
                            .value
                        )
                      }
                      maxLength={
                        1200
                      }
                      placeholder="Write a reply..."
                      className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        void submitReply(
                          item._id
                        )
                      }
                      disabled={
                        busy ||
                        !replyText.trim()
                      }
                      aria-label="Send reply"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* ===================================================
            COMMENT INPUT - FARMER
        ==================================================== */}

        {isFarmer ? (
          <form
            onSubmit={
              submitComment
            }
            className="flex gap-2"
          >
            <input
              id={`comment-${post._id}`}
              value={
                comment
              }
              onChange={(
                event
              ) =>
                setComment(
                  event.target
                    .value
                )
              }
              placeholder="Write a comment..."
              maxLength={
                1800
              }
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              disabled={
                busy ||
                !comment.trim()
              }
              aria-label="Send comment"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        ) : !isAuthenticated ? (

          /* =================================================
             LOGGED OUT

             Can read everything.
             Cannot interact.
          ================================================== */

          <button
            type="button"
            onClick={
              login
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
          >
            <LockKeyhole className="h-4 w-4" />

            Login to like, comment or reply
          </button>
        ) : null}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
            {
              error
            }
          </div>
        )}
      </div>
    </article>
  );
}