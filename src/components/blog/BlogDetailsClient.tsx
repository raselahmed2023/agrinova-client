"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Eye,
  Loader2,
  MessageCircle,
  Reply,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import {
  useSession,
} from "@/lib/auth-client";

import {
  addBlogComment,
  addBlogReply,
} from "@/services/blog.service";

import type {
  IBlogComment,
  IBlogSingleResponse,
} from "@/types/blog";

interface BlogDetailsClientProps {
  initialData:
    IBlogSingleResponse;
}

export default function BlogDetailsClient({
  initialData,
}: BlogDetailsClientProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const { data: session } =
    useSession();

  const blog =
    initialData.blog;

  const [
    comments,
    setComments,
  ] =
    useState<
      IBlogComment[]
    >(
      blog.comments ||
        []
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
    useState<
      Record<
        string,
        string
      >
    >({});

  const [
    replyingTo,
    setReplyingTo,
  ] =
    useState<
      string | null
    >(null);

  const [
    submittingKey,
    setSubmittingKey,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const userRole =
    session?.user?.role
      ?.toUpperCase();

  const canDiscuss =
    userRole ===
      "FARMER" ||
    userRole ===
      "EXPERT" ||
    userRole ===
      "ADMIN";

  const redirectToLogin =
    () => {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          pathname
        )}`
      );
    };



  const submitComment =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (!canDiscuss) {
        redirectToLogin();

        return;
      }

      const content =
        commentText.trim();

      if (!content) {
        return;
      }

      try {
        setSubmittingKey(
          "comment"
        );

        setError("");

        const created =
          await addBlogComment(
            blog._id,
            content
          );

        setComments(
          (
            current
          ) => [
            ...current,
            created,
          ]
        );

        setCommentText(
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
        setSubmittingKey(
          ""
        );
      }
    };



  const submitReply =
    async (
      commentId:
        string
    ) => {
      if (!canDiscuss) {
        redirectToLogin();

        return;
      }

      const content =
        replyText[
          commentId
        ]?.trim();

      if (!content) {
        return;
      }

      try {
        setSubmittingKey(
          commentId
        );

        setError("");

        const created =
          await addBlogReply(
            blog._id,
            commentId,
            content
          );

        setComments(
          (
            current
          ) =>
            current.map(
              (
                comment
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
            )
        );

        setReplyText(
          (
            current
          ) => ({
            ...current,

            [commentId]:
              "",
          })
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
        setSubmittingKey(
          ""
        );
      }
    };

  const openReply = (
    commentId: string
  ) => {
    if (!canDiscuss) {
      redirectToLogin();

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
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Back */}

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Blog
        </Link>

        {/* Header */}

        <header className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {
                blog.category
              }
            </span>

            <span>
              {
                blog.readTime
              }
            </span>

            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />

              {
                blog.views
              }
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            {
              blog.title
            }
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            {
              blog.summary
            }
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-black text-emerald-800">

              {blog.author
                .avatar ? (
                <img
                  src={
                    blog.author
                      .avatar
                  }
                  alt={
                    blog.author
                      .name
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                blog.author.name
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div>
              <p className="font-black text-slate-900">
                {
                  blog.author
                    .name
                }
              </p>

              <p className="text-sm text-slate-500">
                {blog.author
                  .title ||
                  "Agricultural Expert"}
              </p>
            </div>
          </div>
        </header>

        {/* Cover */}

        {blog.images?.[0] && (
          <img
            src={
              blog.images[0]
            }
            alt={
              blog.title
            }
            className="mt-7 max-h-[560px] w-full rounded-3xl object-cover shadow-sm"
          />
        )}

        {/* Article */}

        <div className="prose prose-slate mt-7 max-w-none rounded-3xl border border-slate-200 bg-white p-6 leading-8 shadow-sm md:p-9">
          <ReactMarkdown>
            {
              blog.content
            }
          </ReactMarkdown>
        </div>

        {/* Tags */}

        {blog.tags?.length >
          0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {blog.tags.map(
              (
                tag
              ) => (
                <span
                  key={
                    tag
                  }
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                >
                  #
                  {
                    tag
                  }
                </span>
              )
            )}
          </div>
        )}

        {/* Discussion */}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <MessageCircle className="h-6 w-6 text-emerald-700" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Discussion
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Everyone can
                read the
                discussion.
                Sign in to
                comment or
                reply.
              </p>
            </div>
          </div>

          {/* Comment form */}

          <form
            onSubmit={
              submitComment
            }
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
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
              onFocus={() => {
                if (
                  !canDiscuss
                ) {
                  redirectToLogin();
                }
              }}
              maxLength={
                1500
              }
              placeholder={
                canDiscuss
                  ? "Ask a question or share an experience..."
                  : "Sign in to join the discussion"
              }
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              disabled={
                submittingKey ===
                  "comment" ||
                (canDiscuss &&
                  !commentText.trim())
              }
              className="flex min-h-12 min-w-28 items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submittingKey ===
              "comment" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Comment"
              )}
            </button>
          </form>

          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {
                error
              }
            </p>
          )}

          {/* Comments */}

          <div className="mt-7 space-y-5">
            {comments.length ===
            0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-center">
                <MessageCircle className="mx-auto h-7 w-7 text-slate-300" />

                <p className="mt-2 text-sm text-slate-500">
                  No comments yet.
                </p>
              </div>
            ) : (
              comments.map(
                (
                  comment
                ) => (
                  <div
                    key={
                      comment._id
                    }
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-900">
                          {
                            comment.userName
                          }
                        </p>

                        <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                          {
                            comment.userRole
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openReply(
                            comment._id
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-emerald-700"
                      >
                        <Reply className="h-4 w-4" />

                        Reply
                      </button>
                    </div>

                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {
                        comment.content
                      }
                    </p>

                    {/* Replies */}

                    {comment
                      .replies
                      ?.length >
                      0 && (
                      <div className="mt-4 space-y-3 border-l-2 border-emerald-100 pl-4">
                        {comment.replies.map(
                          (
                            reply
                          ) => (
                            <div
                              key={
                                reply._id
                              }
                              className="rounded-xl border border-slate-100 bg-white p-3"
                            >
                              <p className="text-sm font-black text-slate-900">
                                {
                                  reply.userName
                                }

                                <span className="ml-2 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                                  {
                                    reply.userRole
                                  }
                                </span>
                              </p>

                              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {
                                  reply.content
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Reply form */}

                    {replyingTo ===
                      comment._id && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={
                            replyText[
                              comment
                                ._id
                            ] ||
                            ""
                          }
                          onChange={(
                            event
                          ) =>
                            setReplyText(
                              (
                                current
                              ) => ({
                                ...current,

                                [comment._id]:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          maxLength={
                            1000
                          }
                          placeholder="Write a reply..."
                          className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />

                        <button
                          type="button"
                          disabled={
                            submittingKey ===
                              comment._id ||
                            !replyText[
                              comment
                                ._id
                            ]?.trim()
                          }
                          onClick={() =>
                            void submitReply(
                              comment._id
                            )
                          }
                          className="flex min-h-11 min-w-24 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {submittingKey ===
                          comment._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Reply"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* Previous / next */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {initialData.prevBlog ? (
            <Link
              href={`/blog/${initialData.prevBlog.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Previous article
              </p>

              <p className="mt-2 font-black text-slate-900">
                {
                  initialData
                    .prevBlog
                    .title
                }
              </p>
            </Link>
          ) : (
            <div />
          )}

          {initialData.nextBlog && (
            <Link
              href={`/blog/${initialData.nextBlog.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 sm:text-right"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Next article
              </p>

              <p className="mt-2 font-black text-slate-900">
                {
                  initialData
                    .nextBlog
                    .title
                }
              </p>
            </Link>
          )}
        </div>
      </article>
    </main>
  );
}