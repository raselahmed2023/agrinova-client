"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CalendarDays,
  Clock3,
  Eye,
  Loader2,
  MessageCircle,
  Reply,
  Send,
  Tag,
  User2,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import {
  useSession,
} from "@/lib/auth-client";

import {
  addBlogComment,
  addBlogReply,
} from "@/services/blog.service";

import {
  getExpertById,
} from "@/services/expert.service";

import type {
  IBlogComment,
  IBlogSingleResponse,
} from "@/types/blog";

import type {
  ExpertProfile,
} from "@/types/expert";

interface BlogDetailsClientProps {
  initialData:
    IBlogSingleResponse;
}

function formatDate(
  value?: string
) {
  if (!value) {
    return "Recent";
  }

  const date =
    new Date(value);

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
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

function initials(
  name?: string
) {
  if (!name) {
    return "AE";
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

function specializationText(
  value?:
    | string
    | string[]
) {
  if (!value) {
    return "";
  }

  return Array.isArray(
    value
  )
    ? value.join(", ")
    : value;
}

function sortCommentsNewestFirst(
  comments: IBlogComment[]
): IBlogComment[] {
  return [
    ...comments,
  ].sort(
    (a, b) => {
      const aTime =
        new Date(
          a.createdAt ||
            0
        ).getTime();

      const bTime =
        new Date(
          b.createdAt ||
            0
        ).getTime();

      return (
        bTime -
        aTime
      );
    }
  );
}

export default function BlogDetailsClient({
  initialData,
}: BlogDetailsClientProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    data: session,
  } =
    useSession();

  const blog =
    initialData.blog;

  /* =========================================================
     LIVE EXPERT PROFILE
  ========================================================= */

  const [
    liveAuthor,
    setLiveAuthor,
  ] =
    useState<
      ExpertProfile | null
    >(null);

  useEffect(() => {
    let active = true;

    const loadAuthorProfile =
      async () => {
        const authorId =
          blog.author?.id;

        if (!authorId) {
          setLiveAuthor(
            null
          );

          return;
        }

        try {
          const expert =
            await getExpertById(
              authorId
            );

          if (active) {
            setLiveAuthor(
              expert
            );
          }
        } catch (
          error
        ) {
          console.error(
            "Unable to load latest expert profile:",
            error
          );
        }
      };

    void loadAuthorProfile();

    return () => {
      active = false;
    };
  }, [
    blog._id,
    blog.author?.id,
  ]);

  const author = {
    ...blog.author,

    name:
      liveAuthor?.name ||
      blog.author?.name ||
      "AgriNova Expert",

    avatar:
      liveAuthor?.avatar ||
      liveAuthor?.image ||
      blog.author?.avatar ||
      "",

    title:
      liveAuthor?.title ||
      blog.author?.title ||
      "Agricultural Specialist",

    specialization:
      liveAuthor
        ?.specialization
        ?.length
        ? liveAuthor.specialization
        : blog.author
            ?.specialization,

    bio:
      liveAuthor?.bio ||
      blog.author?.bio ||
      "",
  };

  /* =========================================================
     COMMENTS
  ========================================================= */

  const [
    comments,
    setComments,
  ] =
    useState<
      IBlogComment[]
    >(
      sortCommentsNewestFirst(
        blog.comments ||
          []
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

  useEffect(() => {
    setComments(
      sortCommentsNewestFirst(
        blog.comments ||
          []
      )
    );

    setCommentText("");

    setReplyText({});

    setReplyingTo(
      null
    );

    setError("");
  }, [
    blog._id,
    blog.comments,
  ]);

  const role =
    session?.user?.role
      ?.toUpperCase();

  const canDiscuss =
    role ===
      "FARMER" ||
    role ===
      "EXPERT" ||
    role ===
      "ADMIN";

  const goToLogin =
    () => {
      router.push(
        `/login?redirect=${encodeURIComponent(
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
        goToLogin();

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

        // New comment always appears first.
        setComments(
          (
            current
          ) => [
            created,
            ...current,
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
        goToLogin();

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

  const toggleReply =
    (
      commentId:
        string
    ) => {
      if (!canDiscuss) {
        goToLogin();

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

  const cover =
    blog.images?.[0] ||
    "/images/marketplace-bg.jpg";

  const authorSpecialization =
    specializationText(
      author.specialization
    );

  return (
    <main className="min-h-screen bg-[#F5F8F3]">
      <section className="px-3 py-7 sm:px-4 lg:px-5 lg:py-9">
        <div className="mx-auto w-full max-w-[1600px]">

          <Link
            href="/blog"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Blog
          </Link>

          {/* =====================================================
              HERO
          ====================================================== */}

          <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">

            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

              {/* LEFT */}

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                    {
                      blog.category
                    }
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />

                    {blog.readTime ||
                      "5 min read"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                    <Eye className="h-3.5 w-3.5" />

                    {Number(
                      blog.views ||
                        0
                    ).toLocaleString(
                      "en-US"
                    )}{" "}
                    views
                  </span>

                </div>

                <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-4xl xl:text-[3.25rem]">
                  {
                    blog.title
                  }
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg lg:leading-8">
                  {
                    blog.summary
                  }
                </p>

                <div className="mt-7 border-t border-slate-200 pt-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-100">

                        {author.avatar ? (
                          <Image
                            src={
                              author.avatar
                            }
                            alt={
                              author.name ||
                              "Author"
                            }
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-extrabold text-emerald-800">
                            {initials(
                              author.name
                            )}
                          </span>
                        )}

                      </div>

                      <div>

                        <p className="font-bold text-slate-900">
                          {
                            author.name
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {
                            author.title
                          }
                        </p>

                      </div>

                    </div>

                    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">

                      <CalendarDays className="h-4 w-4 text-emerald-600" />

                      {formatDate(
                        blog.createdAt
                      )}

                    </span>

                  </div>

                </div>

              </div>

              {/* RIGHT IMAGE */}

              <div className="relative min-h-[360px] overflow-hidden lg:min-h-[560px]">

                <Image
                  src={
                    cover
                  }
                  alt={
                    blog.title
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-[#052F23]/55 via-black/10 to-black/40" />

                <div className="absolute inset-0 flex items-center justify-center p-6">

                  <div className="w-full max-w-lg rounded-[26px] border border-white/20 bg-black/15 p-6 text-center text-white shadow-2xl backdrop-blur-md sm:p-8">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">

                      <BookOpenText className="h-6 w-6" />

                    </div>

                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                      AgriNova Expert Guide
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                      {
                        blog.category
                      }
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/90">
                      Practical agricultural
                      knowledge and
                      field-focused guidance
                      from AgriNova
                      specialists.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              ARTICLE
          ====================================================== */}

          <section className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_350px]">

            <article className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

              <div className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:text-slate-900 prose-p:leading-8 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800">

                <ReactMarkdown>
                  {
                    blog.content
                  }
                </ReactMarkdown>

              </div>

              {blog.tags?.length >
                0 && (

                <div className="mt-10 border-t border-slate-200 pt-6">

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">

                    <Tag className="h-4 w-4 text-emerald-700" />

                    Topics Covered

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {blog.tags.map(
                      (
                        tag
                      ) => (

                        <span
                          key={
                            tag
                          }
                          className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                        >
                          #{tag}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

            </article>

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside className="space-y-6">

              {/* AUTHOR */}

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">

                  <User2 className="h-4 w-4" />

                  About the Author

                </div>

                <div className="mt-5 flex items-center gap-3">

                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-100">

                    {author.avatar ? (

                      <Image
                        src={
                          author.avatar
                        }
                        alt={
                          author.name ||
                          "Author"
                        }
                        fill
                        sizes="56px"
                        className="object-cover"
                      />

                    ) : (

                      <span className="text-sm font-extrabold text-emerald-800">

                        {initials(
                          author.name
                        )}

                      </span>

                    )}

                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-extrabold text-slate-900">
                      {
                        author.name
                      }
                    </h3>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      {
                        author.title
                      }
                    </p>

                  </div>

                </div>

                {authorSpecialization && (

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Specialization
                    </p>

                    <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-700">
                      {
                        authorSpecialization
                      }
                    </p>

                  </div>

                )}

                {author.bio && (

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {
                      author.bio
                    }
                  </p>

                )}

              </div>

              {/* ARTICLE INFO */}

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">

                  <BookOpenText className="h-4 w-4" />

                  Article Info

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Read Time
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-800">

                      {blog.readTime ||
                        "5 min"}

                    </p>

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Views
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-800">

                      {Number(
                        blog.views ||
                          0
                      ).toLocaleString(
                        "en-US"
                      )}

                    </p>

                  </div>

                </div>

                <div className="mt-3 rounded-2xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Published
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-slate-800">

                    {formatDate(
                      blog.createdAt
                    )}

                  </p>

                </div>

              </div>

            </aside>

          </section>

          {/* =====================================================
              COMMENTS
          ====================================================== */}

          <section className="mt-7 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">

                  <MessageCircle className="h-4 w-4" />

                  Community Discussion

                </div>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  Comments
                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  {comments.length}{" "}

                  {comments.length ===
                  1
                    ? "comment"
                    : "comments"}

                </p>

              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                <BadgeCheck className="h-4 w-4" />

                Signed-in users can
                participate

              </div>

            </div>

            {/* COMMENT FORM */}

            <form
              onSubmit={
                submitComment
              }
              className="mt-6"
            >

              <textarea
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
                    goToLogin();
                  }
                }}
                rows={4}
                maxLength={
                  1500
                }
                placeholder={
                  canDiscuss
                    ? "Ask a question or share your farming experience..."
                    : "Sign in to join the discussion"
                }
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />

              <div className="mt-3 flex items-center justify-between gap-3">

                <p className="text-xs text-slate-400">

                  {
                    commentText.length
                  }
                  /1500

                </p>

                <button
                  type="submit"
                  disabled={
                    submittingKey ===
                      "comment" ||
                    (canDiscuss &&
                      !commentText.trim())
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B7A57] px-5 text-sm font-bold text-white transition hover:bg-[#086849] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {submittingKey ===
                  "comment" ? (

                    <Loader2 className="h-4 w-4 animate-spin" />

                  ) : (

                    <>
                      Post Comment

                      <Send className="h-4 w-4" />
                    </>

                  )}

                </button>

              </div>

            </form>

            {/* ERROR */}

            {error && (

              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">

                {error}

              </div>

            )}

            {/* COMMENTS LIST
                No empty-state box.
                If zero comments, nothing extra is rendered.
            */}

            {comments.length >
              0 && (

              <div className="mt-7 space-y-4">

                {comments.map(
                  (
                    comment
                  ) => (

                    <article
                      key={
                        comment._id
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <p className="font-bold text-slate-900">
                              {
                                comment.userName
                              }
                            </p>

                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                              {
                                comment.userRole
                              }
                            </span>

                          </div>

                          <p className="mt-1 text-[11px] text-slate-400">

                            {formatDate(
                              comment.createdAt
                            )}

                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleReply(
                              comment._id
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-white hover:text-emerald-700"
                        >

                          <Reply className="h-3.5 w-3.5" />

                          Reply

                        </button>

                      </div>

                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                        {
                          comment.content
                        }
                      </p>

                      {/* REPLIES */}

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
                                className="rounded-xl border border-slate-100 bg-white p-3.5"
                              >

                                <div className="flex flex-wrap items-center gap-2">

                                  <p className="text-sm font-bold text-slate-900">
                                    {
                                      reply.userName
                                    }
                                  </p>

                                  <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                                    {
                                      reply.userRole
                                    }
                                  </span>

                                </div>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                  {
                                    reply.content
                                  }
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      )}

                      {/* REPLY FORM */}

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
                            className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5"
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
                            className="inline-flex min-h-11 min-w-24 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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

                    </article>

                  )
                )}

              </div>

            )}

          </section>

          {/* =====================================================
              PREVIOUS / NEXT
          ====================================================== */}

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            {initialData.prevBlog ? (

              <Link
                prefetch={
                  false
                }
                href={`/blog/${initialData.prevBlog.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Previous Article
                </p>

                <p className="mt-2 line-clamp-2 font-bold text-slate-900 transition group-hover:text-emerald-700">
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
                prefetch={
                  false
                }
                href={`/blog/${initialData.nextBlog.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:text-right"
              >

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Next Article
                </p>

                <p className="mt-2 line-clamp-2 font-bold text-slate-900 transition group-hover:text-emerald-700">
                  {
                    initialData
                      .nextBlog
                      .title
                  }
                </p>

                <ArrowRight className="ml-auto mt-2 h-4 w-4 text-emerald-700" />

              </Link>

            )}

          </div>

        </div>
      </section>
    </main>
  );
}