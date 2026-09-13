import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  CalendarDays,
  Clock3,
  Eye,
  MessageCircle,
  Quote,
  Send,
  Tag,
  User2,
} from "lucide-react";

import {
  getBlogs,
  getBlogByIdOrSlug,
} from "@/services/blog.service";

import type { IBlog } from "@/types/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;



interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}



export async function generateMetadata({
  params,
}: BlogPageProps) {
  try {
    const { slug } = await params;

    const result =
      await getBlogByIdOrSlug(slug);

    const post = result.blog;

    if (!post) {
      return {
        title: "Blog | AgriNova",
        description:
          "Agricultural knowledge and expert farming guides from AgriNova.",
      };
    }

    return {
      title: `${post.title} | AgriNova`,
      description:
        post.summary ||
        "Agricultural knowledge and expert farming guide from AgriNova.",
    };
  } catch {
    return {
      title: "Blog | AgriNova",
      description:
        "Agricultural knowledge and expert farming guides from AgriNova.",
    };
  }
}



function getCoverImage(
  post: IBlog
) {
  return (
    post.images?.[0] ||
    "/images/marketplace-bg.jpg"
  );
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
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function getAuthorInitials(
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

function getSpecialization(
  specialization?:
    | string
    | string[]
) {
  if (!specialization) {
    return "";
  }

  if (
    Array.isArray(
      specialization
    )
  ) {
    return specialization.join(
      ", "
    );
  }

  return specialization;
}



function renderArticleContent(
  content: string
) {
  if (!content) {
    return null;
  }

  const blocks =
    content
      .split(/\n\s*\n/)
      .map((block) =>
        block.trim()
      )
      .filter(Boolean);

  return blocks.map(
    (block, index) => {
      const lines =
        block
          .split("\n")
          .map((line) =>
            line.trim()
          )
          .filter(Boolean);

      const firstLine =
        lines[0] || "";



      if (
        firstLine.startsWith(
          "### "
        )
      ) {
        const title =
          firstLine
            .replace(
              /^###\s+/,
              ""
            )
            .replace(
              /\*\*/g,
              ""
            );

        return (
          <section
            key={index}
            className="space-y-4"
          >
            <h2 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
              {title}
            </h2>

            {lines
              .slice(1)
              .map(
                (
                  line,
                  lineIndex
                ) => (
                  <p
                    key={
                      lineIndex
                    }
                    className="whitespace-pre-line text-[15px] leading-8 text-slate-600 sm:text-base"
                  >
                    {line.replace(
                      /\*\*/g,
                      ""
                    )}
                  </p>
                )
              )}
          </section>
        );
      }

 

      if (
        firstLine.startsWith(
          "## "
        )
      ) {
        const title =
          firstLine
            .replace(
              /^##\s+/,
              ""
            )
            .replace(
              /\*\*/g,
              ""
            );

        return (
          <section
            key={index}
            className="space-y-4"
          >
            <h2 className="text-2xl font-extrabold leading-snug text-slate-900">
              {title}
            </h2>

            {lines
              .slice(1)
              .map(
                (
                  line,
                  lineIndex
                ) => (
                  <p
                    key={
                      lineIndex
                    }
                    className="whitespace-pre-line text-[15px] leading-8 text-slate-600 sm:text-base"
                  >
                    {line.replace(
                      /\*\*/g,
                      ""
                    )}
                  </p>
                )
              )}
          </section>
        );
      }

     

      if (
        lines.every(
          (line) =>
            line.startsWith(
              "- "
            ) ||
            line.startsWith(
              "* "
            )
        )
      ) {
        return (
          <ul
            key={index}
            className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
          >
            {lines.map(
              (
                line,
                lineIndex
              ) => (
                <li
                  key={
                    lineIndex
                  }
                  className="flex items-start gap-3 text-[15px] leading-7 text-slate-700"
                >
                  <span className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-emerald-600" />

                  <span>
                    {line
                      .replace(
                        /^[-*]\s+/,
                        ""
                      )
                      .replace(
                        /\*\*/g,
                        ""
                      )}
                  </span>
                </li>
              )
            )}
          </ul>
        );
      }

    

      if (
        lines.every(
          (line) =>
            /^\d+\.\s/.test(
              line
            )
        )
      ) {
        return (
          <ol
            key={index}
            className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            {lines.map(
              (
                line,
                lineIndex
              ) => (
                <li
                  key={
                    lineIndex
                  }
                  className="flex items-start gap-3 text-[15px] leading-7 text-slate-700"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B7A57] text-xs font-bold text-white">
                    {lineIndex +
                      1}
                  </span>

                  <span>
                    {line
                      .replace(
                        /^\d+\.\s+/,
                        ""
                      )
                      .replace(
                        /\*\*/g,
                        ""
                      )}
                  </span>
                </li>
              )
            )}
          </ol>
        );
      }

    

      return (
        <p
          key={index}
          className="whitespace-pre-line text-[15px] leading-8 text-slate-600 sm:text-base"
        >
          {block.replace(
            /\*\*/g,
            ""
          )}
        </p>
      );
    }
  );
}



export default async function SingleBlogPage({
  params,
}: BlogPageProps) {
  const { slug } =
    await params;

  let post: IBlog | null =
    null;

  try {
    const result =
      await getBlogByIdOrSlug(
        slug
      );

    post =
      result.blog ||
      null;
  } catch (error) {
    console.error(
      "Failed to load blog:",
      error
    );
  }

  if (!post) {
    notFound();
  }



  let relatedPosts:
    IBlog[] = [];

  try {
    const result =
      await getBlogs({
        limit: 4,
      });

    relatedPosts =
      result.blogs
        .filter(
          (
            article
          ) =>
            (
              article.slug ||
              article._id
            ) !==
            (
              post.slug ||
              post._id
            )
        )
        .slice(0, 3);
  } catch (error) {
    console.warn(
      "Related blogs unavailable:",
      error
    );

    relatedPosts = [];
  }

  const specialization =
    getSpecialization(
      post.author
        ?.specialization
    );

  return (
    <main className="min-h-screen bg-[#F5F8F3]">
      <section className="px-3 py-7 sm:px-4 lg:px-5 lg:py-9">
        <div className="mx-auto w-full max-w-[1600px]">
         

          <Link
            href="/blog"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Blog
          </Link>

    
          <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                    {post.category}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />

                    {post.readTime ||
                      "5 min read"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                    <Eye className="h-3.5 w-3.5" />

                    {Number(
                      post.views ||
                        0
                    ).toLocaleString(
                      "en-US"
                    )}{" "}
                    views
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-4xl xl:text-[3.35rem]">
                  {post.title}
                </h1>

                {post.summary && (
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg lg:leading-8">
                    {post.summary}
                  </p>
                )}

                {/* AUTHOR */}

                <div className="mt-7 border-t border-slate-200 pt-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-100">
                        {post.author
                          ?.avatar ? (
                          <Image
                            src={
                              post.author
                                .avatar
                            }
                            alt={
                              post.author
                                .name ||
                              "Author"
                            }
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-extrabold text-emerald-800">
                            {getAuthorInitials(
                              post.author
                                ?.name
                            )}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {post.author
                            ?.name ||
                            "AgriNova Expert"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {post.author
                            ?.title ||
                            "Agricultural Specialist"}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />

                      {formatDate(
                        post.createdAt
                      )}
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="relative min-h-[360px] overflow-hidden lg:min-h-[560px]">
                <Image
                  src={getCoverImage(
                    post
                  )}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-[#052F23]/55 via-black/15 to-black/40" />

                <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                  <div className="w-full max-w-lg rounded-[26px] border border-white/20 bg-black/15 p-6 text-center text-white shadow-2xl backdrop-blur-md sm:p-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                      <BookOpenText className="h-6 w-6" />
                    </div>

                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                      AgriNova Expert
                      Guide
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {post.category}
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/90">
                      Practical
                      agricultural
                      knowledge,
                      field-tested
                      strategies and
                      expert guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

         

          <section className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_350px]">
          

            <div className="min-w-0 space-y-7">
              {/* ARTICLE */}

              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <Quote className="h-4 w-4" />

                  Expert Article
                </div>

                <div className="mt-7 space-y-7">
                  {renderArticleContent(
                    post.content
                  )}
                </div>

                {/* TAGS */}

                {post.tags?.length >
                  0 && (
                  <div className="mt-10 border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Tag className="h-4 w-4 text-emerald-700" />

                      Topics Covered
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map(
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

             

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
                  {/* COMMENT FORM */}

                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                      <MessageCircle className="h-4 w-4" />

                      Discussion
                    </div>

                    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                      Leave a Comment
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      Share a farming
                      experience,
                      question or useful
                      observation related
                      to this article.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="comment-name"
                          className="mb-2 block text-xs font-bold text-slate-600"
                        >
                          Name
                        </label>

                        <input
                          id="comment-name"
                          type="text"
                          placeholder="Your name"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="comment-email"
                          className="mb-2 block text-xs font-bold text-slate-600"
                        >
                          Email
                        </label>

                        <input
                          id="comment-email"
                          type="email"
                          placeholder="Your email"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="comment-text"
                        className="mb-2 block text-xs font-bold text-slate-600"
                      >
                        Comment
                      </label>

                      <textarea
                        id="comment-text"
                        rows={6}
                        placeholder="Write your comment..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                      />
                    </div>

                    <button
                      type="button"
                      className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B7A57] px-5 text-sm font-bold text-white transition hover:bg-[#086849]"
                    >
                      Post Comment

                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  {/* COMMENT SIDE PANEL */}

                  <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                      <BadgeCheck className="h-4 w-4" />

                      Community
                      Discussion
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                        <p className="font-bold text-slate-900">
                          Be the first
                          to comment
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Start a useful
                          conversation
                          about this
                          farming topic.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                        <p className="font-bold text-slate-900">
                          Good
                          discussions
                        </p>

                        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                          <p>
                            • Share real
                            field
                            experience
                          </p>

                          <p>
                            • Ask useful
                            questions
                          </p>

                          <p>
                            • Keep
                            discussion
                            respectful
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ===============================================
                RIGHT SIDEBAR
            =============================================== */}

            <aside className="space-y-6">
              {/* AUTHOR */}

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <User2 className="h-4 w-4" />

                  About the Author
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-100">
                    {post.author
                      ?.avatar ? (
                      <Image
                        src={
                          post.author
                            .avatar
                        }
                        alt={
                          post.author
                            .name ||
                          "Author"
                        }
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-sm font-extrabold text-emerald-800">
                        {getAuthorInitials(
                          post.author
                            ?.name
                        )}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-extrabold text-slate-900">
                      {post.author
                        ?.name ||
                        "AgriNova Expert"}
                    </h3>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      {post.author
                        ?.title ||
                        "Agricultural Specialist"}
                    </p>
                  </div>
                </div>

                {specialization && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Specialization
                    </p>

                    <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-700">
                      {specialization}
                    </p>
                  </div>
                )}

                {post.author?.bio && (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {post.author.bio}
                  </p>
                )}
              </div>

              {/* ARTICLE INFO */}

              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <BookOpenText className="h-4 w-4" />

                  Article Info
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Category
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-800">
                      {post.category}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Published
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-800">
                      {formatDate(
                        post.createdAt
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Read Time
                      </p>

                      <p className="mt-1.5 text-sm font-bold text-slate-800">
                        {post.readTime ||
                          "5 min"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Views
                      </p>

                      <p className="mt-1.5 text-sm font-bold text-slate-800">
                        {Number(
                          post.views ||
                            0
                        ).toLocaleString(
                          "en-US"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RELATED POSTS */}

              {relatedPosts.length >
                0 && (
                <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    <ArrowRight className="h-4 w-4" />

                    More Articles
                  </div>

                  <div className="mt-5 space-y-3">
                    {relatedPosts.map(
                      (
                        related
                      ) => (
                        <Link
                          key={
                            related._id ||
                            related.slug
                          }
                          href={`/blog/${
                            related.slug ||
                            related._id
                          }`}
                          className="group flex gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                        >
                          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            <Image
                              src={
                                related
                                  .images?.[0] ||
                                "/images/marketplace-bg.jpg"
                              }
                              alt={
                                related.title
                              }
                              fill
                              sizes="96px"
                              className="object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                              {
                                related.category
                              }
                            </p>

                            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-slate-800 transition group-hover:text-emerald-700">
                              {
                                related.title
                              }
                            </h3>

                            <p className="mt-1 text-[10px] text-slate-400">
                              {related.readTime ||
                                "5 min read"}
                            </p>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}