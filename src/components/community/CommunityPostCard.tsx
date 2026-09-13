"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Reply,
  Send,
  Trash2,
} from "lucide-react";

import {
  addCommunityComment,
  addCommunityReply,
  deleteCommunityPost,
  toggleCommunityLike,
  updateCommunityPost,
} from "@/services/community.service";

import type {
  CommunityComment,
  CommunityPost,
  CommunityReply,
} from "@/types/community";

function initials(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (
        part
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
  value:
    string
) {
  const date =
    new Date(
      value
    );

  const seconds =
    Math.max(
      Math.floor(
        (Date.now() -
          date.getTime()) /
          1000
      ),
      0
    );

  if (
    seconds < 60
  ) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

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

function Avatar({
  name,
  src,
  size =
    "h-10 w-10",
}: {
  name: string;

  src?:
    string;

  size?:
    string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-black text-emerald-800 ${size}`}
    >
      {src ? (
        <img
          src={
            src
          }
          alt={
            name
          }
          className="h-full w-full object-cover"
        />
      ) : (
        initials(
          name
        )
      )}
    </div>
  );
}

export default function CommunityPostCard({
  initialPost,
  currentUserId,
  currentUserRole,
  onDeleted,
}: {
  initialPost:
    CommunityPost;

  currentUserId?:
    string;

  currentUserRole?:
    string | null;

  onDeleted?: (
    postId:
      string
  ) => void;
}) {
  const router =
    useRouter();

  const role =
    String(
      currentUserRole ||
        ""
    ).toUpperCase();

  const isFarmer =
    role ===
    "FARMER";

  const determineLiked =
    (
      input:
        CommunityPost
    ) =>
      Boolean(
        currentUserId &&
          input.likes?.some(
            (
              id:
                string
            ) =>
              String(
                id
              ) ===
              String(
                currentUserId
              )
          )
      );

  const normalize =
    (
      input:
        CommunityPost
    ): CommunityPost => ({
      ...input,

      likedByMe:
        input.likedByMe ||
        determineLiked(
          input
        ),

      likeCount:
        input.likes?.length ??
        input.likeCount ??
        0,
    });

  const [
    post,
    setPost,
  ] =
    useState<
      CommunityPost
    >(
      () =>
        normalize(
          initialPost
        )
    );

  const [
    commentText,
    setCommentText,
  ] =
    useState("");

  const [
    replyText,
    setReplyText,
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
    editing,
    setEditing,
  ] =
    useState(false);

  const [
    editText,
    setEditText,
  ] =
    useState(
      initialPost.content
    );

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const [
    busyAction,
    setBusyAction,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  /*
    IMPORTANT:
    On refresh, backend returns likes[].
    We calculate visual state from current user's id.
  */
  useEffect(() => {
    setPost(
      (
        current
      ) => ({
        ...current,

        likedByMe:
          determineLiked(
            current
          ),

        likeCount:
          current.likes
            ?.length ??
          current.likeCount ??
          0,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUserId,
  ]);

  const mine =
    Boolean(
      currentUserId &&
        String(
          currentUserId
        ) ===
          String(
            post.authorId
          )
    );

  const login =
    (
      destination =
        "/community"
    ) => {
      router.push(
        `/login?redirect=${encodeURIComponent(
          destination
        )}`
      );
    };

  const requireFarmer =
    () => {
      if (
        !currentUserId
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

  const openProfile =
    (
      farmerId:
        string
    ) => {
      if (
        !currentUserId
      ) {
        login(
          `/community/profile/${farmerId}`
        );

        return;
      }

      if (
        !isFarmer
      ) {
        return;
      }

      router.push(
        `/community/profile/${farmerId}`
      );
    };

  /* ============================================================
     LIKE — OPTIMISTIC + PERSISTENT
  ============================================================ */

  const toggleLike =
    async () => {
      if (
        !requireFarmer() ||
        !currentUserId
      ) {
        return;
      }

      const previous =
        post;

      const wasLiked =
        post.likedByMe ||
        determineLiked(
          post
        );

      const nextLikes =
        wasLiked
          ? post.likes.filter(
              (
                id
              ) =>
                String(id) !==
                String(
                  currentUserId
                )
            )
          : [
              ...post.likes,

              currentUserId,
            ];

      setPost({
        ...post,

        likes:
          nextLikes,

        likedByMe:
          !wasLiked,

        likeCount:
          nextLikes.length,
      });

      try {
        setBusyAction(
          "like"
        );

        setError(
          ""
        );

        const updated =
          await toggleCommunityLike(
            post._id
          );

        setPost(
          normalize(
            updated
          )
        );
      } catch (
        err
      ) {
        setPost(
          previous
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to update like."
        );
      } finally {
        setBusyAction(
          ""
        );
      }
    };

  const submitComment =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (
        !requireFarmer() ||
        !commentText.trim()
      ) {
        return;
      }

      try {
        setBusyAction(
          "comment"
        );

        const created =
          await addCommunityComment(
            post._id,

            commentText.trim()
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

        setCommentText(
          ""
        );
      } finally {
        setBusyAction(
          ""
        );
      }
    };

  const submitReply =
    async (
      commentId:
        string
    ) => {
      if (
        !requireFarmer() ||
        !replyText.trim()
      ) {
        return;
      }

      try {
        setBusyAction(
          `reply-${commentId}`
        );

        const created =
          await addCommunityReply(
            post._id,
            commentId,
            replyText.trim()
          );

        setPost(
          (
            current
          ) => ({
            ...current,

            comments:
              current.comments.map(
                (
                  comment:
                    CommunityComment
                ) =>
                  comment._id ===
                  commentId
                    ? {
                        ...comment,

                        replies: [
                          ...(comment.replies ||
                            []),

                          created,
                        ],
                      }
                    : comment
              ),
          })
        );

        setReplyText(
          ""
        );

        setReplyingTo(
          null
        );
      } finally {
        setBusyAction(
          ""
        );
      }
    };

  const saveEdit =
    async () => {
      if (
        !mine ||
        !editText.trim()
      ) {
        return;
      }

      try {
        setBusyAction(
          "edit"
        );

        const updated =
          await updateCommunityPost(
            post._id,

            {
              content:
                editText.trim(),
            }
          );

        setPost(
          normalize(
            updated
          )
        );

        setEditing(
          false
        );
      } finally {
        setBusyAction(
          ""
        );
      }
    };

  const remove =
    async () => {
      if (
        !mine
      ) {
        return;
      }

      if (
        !window.confirm(
          "Delete this post?"
        )
      ) {
        return;
      }

      try {
        setBusyAction(
          "delete"
        );

        await deleteCommunityPost(
          post._id
        );

        onDeleted?.(
          post._id
        );
      } finally {
        setBusyAction(
          ""
        );
      }
    };

  const likeCount =
    post.likes?.length ??
    post.likeCount ??
    0;

  const commentCount =
    post.comments?.length ??
    post.commentCount ??
    0;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">

      <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4">

        <button
          type="button"
          onClick={() =>
            openProfile(
              post.authorId
            )
          }
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <Avatar
            name={
              post.authorName
            }
            src={
              post.authorAvatar
            }
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900 hover:underline">
              {
                post.authorName
              }
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {timeAgo(
                post.createdAt
              )}{" "}
              · Farmer
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
                    value
                  ) =>
                    !value
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

                <button
                  type="button"
                  onClick={() => {
                    setEditing(
                      true
                    );

                    setMenuOpen(
                      false
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" />

                  Edit post
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void remove()
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />

                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3">
        {editing ? (
          <>
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
              rows={
                4
              }
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
            />

            <div className="mt-2 flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setEditing(
                    false
                  )
                }
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-black"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void saveEdit()
                }
                className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-black text-white"
              >
                {busyAction ===
                "edit" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </>
        ) : (
          <p className="whitespace-pre-wrap break-words text-[15px] leading-6 text-slate-800">
            {
              post.content
            }
          </p>
        )}
      </div>

      {post.images?.length >
        0 && (
        <div
          className={`grid gap-[2px] bg-slate-100 ${
            post.images.length ===
            1
              ? "grid-cols-1"
              : "grid-cols-2"
          }`}
        >
          {post.images.map(
            (
              src,
              index
            ) => (
              <img
                key={`${src}-${index}`}
                src={
                  src
                }
                alt="Community post"
                className={
                  post.images
                    .length ===
                  1
                    ? "max-h-[620px] w-full object-cover"
                    : "h-72 w-full object-cover"
                }
              />
            )
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-500">

        <span>
          {likeCount >
          0
            ? `${likeCount} ${
                likeCount ===
                1
                  ? "like"
                  : "likes"
              }`
            : ""}
        </span>

        <span>
          {commentCount >
          0
            ? `${commentCount} ${
                commentCount ===
                1
                  ? "comment"
                  : "comments"
              }`
            : ""}
        </span>
      </div>

      <div className="mx-4 grid grid-cols-2 border-y border-slate-100 py-1">

        <button
          type="button"
          onClick={() =>
            void toggleLike()
          }
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition ${
            post.likedByMe
              ? "bg-emerald-50 text-emerald-700"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${
              post.likedByMe
                ? "fill-emerald-600 text-emerald-600"
                : ""
            }`}
          />

          Like
        </button>

        <button
          type="button"
          onClick={() => {
            if (
              !requireFarmer()
            ) {
              return;
            }

            document
              .getElementById(
                `community-comment-${post._id}`
              )
              ?.focus();
          }}
          className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          <MessageCircle className="h-5 w-5" />

          Comment
        </button>
      </div>

      <div className="space-y-3 px-4 py-3">

        {post.comments?.map(
          (
            item:
              CommunityComment
          ) => (
            <div
              key={
                item._id
              }
              className="flex items-start gap-2"
            >
              <button
                type="button"
                onClick={() =>
                  openProfile(
                    item.authorId
                  )
                }
              >
                <Avatar
                  name={
                    item.authorName
                  }
                  src={
                    item.authorAvatar
                  }
                  size="h-8 w-8 text-[10px]"
                />
              </button>

              <div className="min-w-0 flex-1">

                <div className="inline-block max-w-full rounded-[18px] bg-[#f0f2f5] px-3.5 py-2">

                  <button
                    type="button"
                    onClick={() =>
                      openProfile(
                        item.authorId
                      )
                    }
                    className="block text-left text-xs font-black hover:underline"
                  >
                    {
                      item.authorName
                    }
                  </button>

                  <p className="mt-0.5 whitespace-pre-wrap text-sm leading-5 text-slate-700">
                    {
                      item.content
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
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
                        item._id
                          ? null
                          : item._id
                    );
                  }}
                  className="ml-3 mt-1 inline-flex items-center gap-1 text-[11px] font-black text-slate-500"
                >
                  <Reply className="h-3 w-3" />

                  Reply
                </button>

                {item.replies?.map(
                  (
                    reply:
                      CommunityReply
                  ) => (
                    <div
                      key={
                        reply._id
                      }
                      className="ml-4 mt-2 flex items-start gap-2"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openProfile(
                            reply.authorId
                          )
                        }
                      >
                        <Avatar
                          name={
                            reply.authorName
                          }
                          src={
                            reply.authorAvatar
                          }
                          size="h-7 w-7 text-[9px]"
                        />
                      </button>

                      <div className="rounded-[17px] bg-[#f0f2f5] px-3 py-2">

                        <button
                          type="button"
                          onClick={() =>
                            openProfile(
                              reply.authorId
                            )
                          }
                          className="text-[11px] font-black hover:underline"
                        >
                          {
                            reply.authorName
                          }
                        </button>

                        <p className="text-sm text-slate-700">
                          {
                            reply.content
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}

                {replyingTo ===
                  item._id &&
                  isFarmer && (
                  <div className="ml-3 mt-2 flex gap-2">

                    <input
                      value={
                        replyText
                      }
                      onChange={(
                        event
                      ) =>
                        setReplyText(
                          event.target
                            .value
                        )
                      }
                      placeholder="Write a reply..."
                      className="min-h-9 flex-1 rounded-full bg-[#f0f2f5] px-4 text-sm outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        void submitReply(
                          item._id
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full text-emerald-700"
                    >
                      {busyAction ===
                      `reply-${item._id}` ? (
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

        {isFarmer && (
          <form
            onSubmit={
              submitComment
            }
            className="flex items-center gap-2 pt-1"
          >
            <div className="flex min-w-0 flex-1 items-center rounded-full bg-[#f0f2f5] pr-1">

              <input
                id={`community-comment-${post._id}`}
                value={
                  commentText
                }
                onChange={(
                  event
                ) =>
                  setCommentText(
                    event.target
                      .value
                  )
                }
                placeholder="Write a comment..."
                className="min-h-10 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
              />

              <button
                type="submit"
                disabled={
                  !commentText.trim()
                }
                className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-700 disabled:opacity-30"
              >
                {busyAction ===
                "comment" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
            {
              error
            }
          </div>
        )}
      </div>
    </article>
  );
}