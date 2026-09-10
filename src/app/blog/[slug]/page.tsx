import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaRegCalendar,
  FaRegClock,
  FaArrowLeft,
} from "react-icons/fa";

import {
  getBlogs,
  getBlogByIdOrSlug,
} from "@/services/blog.service";

import type { IBlog } from "@/types/blog";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}



export async function generateStaticParams() {
  const result = await getBlogs({
    status: "PUBLISHED",
    limit: 100,
  });

  return result.blogs.map((post: IBlog) => ({
    slug: post.slug,
  }));
}



export async function generateMetadata({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  const result = await getBlogByIdOrSlug(slug);

  const post = result.blog;

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}



function getAuthorAvatar(post: IBlog) {
  return (
    post.author?.avatar ||
    "/images/default-avatar.png"
  );
}

function getCoverImage(post: IBlog) {
  return (
    post.images?.[0] ||
    "/images/marketplace-bg.jpg"
  );
}



export default async function SingleBlogPage({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  const result = await getBlogByIdOrSlug(slug);

  const post = result.blog;

  if (!post) {
    notFound();
  }

  const relatedPosts: IBlog[] = [];

  /*
   * Get a few published blogs for the "More Articles" section.
   * The current post is excluded.
   */
  try {
    const blogsResult = await getBlogs({
      status: "PUBLISHED",
      limit: 3,
    });

    relatedPosts.push(
      ...blogsResult.blogs
        .filter((blog: IBlog) => blog.slug !== post.slug)
        .slice(0, 2)
    );
  } catch {
    // Related posts are optional.
  }

  return (
    <article className="w-full bg-[#F7F8FC] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">

        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#063d2d] hover:underline"
        >
          <FaArrowLeft className="h-3 w-3" />
          Back to Blog
        </Link>

        {/* Category */}
        <span className="mt-6 block text-xs font-bold tracking-wide text-[#0a9b4e]">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-[#063d2d]">
          {post.title}
        </h1>

        {/* Author + Meta */}
        <div className="mt-5 flex flex-wrap items-center gap-4">

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={getAuthorAvatar(post)}
                alt={post.author?.name || "Author"}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-sm font-semibold text-[#0b241c]">
              {post.author?.name || "AgriNova Expert"}
            </span>
          </div>

          {/* Date */}
          <span className="flex items-center gap-1.5 text-xs text-[#46605a]">
            <FaRegCalendar className="h-3 w-3" />

            {new Date(post.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </span>

          {/* Read Time */}
          <span className="flex items-center gap-1.5 text-xs text-[#46605a]">
            <FaRegClock className="h-3 w-3" />
            {post.readTime || "5 min read"}
          </span>
        </div>

        {/* Cover Image */}
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={getCoverImage(post)}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Summary */}
        {post.summary && (
          <p className="mt-8 text-lg font-medium leading-relaxed text-[#29443c]">
            {post.summary}
          </p>
        )}

        {/* Article Content */}
        <div className="mt-8 flex flex-col gap-5">
          {post.content
            .split(/\n\s*\n/)
            .filter((paragraph) => paragraph.trim())
            .map(
              (
                paragraph: string,
                index: number
              ) => (
                <p
                  key={index}
                  className="whitespace-pre-line text-[15px] leading-relaxed text-[#3f5650] sm:text-base"
                >
                  {paragraph.trim()}
                </p>
              )
            )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-[#EAF4ED] px-3 py-1 text-xs font-medium text-[#0B513D]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-[#c7d3d1] pt-10">

            <h2 className="text-xl font-bold text-[#063d2d]">
              More Articles
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedPosts.map(
                (related: IBlog) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#c7d3d1] bg-white transition hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-40 w-full">
                      <Image
                        src={
                          related.images?.[0] ||
                          "/images/marketplace-bg.jpg"
                        }
                        alt={related.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <span className="text-xs font-bold text-[#0a9b4e]">
                        {related.category}
                      </span>

                      <h3 className="mt-1 text-sm font-bold leading-snug text-[#0b241c] group-hover:text-[#063d2d]">
                        {related.title}
                      </h3>

                      {related.summary && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#60756f]">
                          {related.summary}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}