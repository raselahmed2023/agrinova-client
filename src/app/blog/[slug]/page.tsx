import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaRegCalendar, FaRegClock, FaArrowLeft } from "react-icons/fa";
import { getBlogPosts, type BlogPost } from "../page";

// ---------- Pre-build a page for every slug found in blogpost.json ----------
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ---------- Page <title> per post ----------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  return {
    title: post ? post.title : "Blog Post Not Found",
    description: post?.excerpt,
  };
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 15+ passes `params` as a Promise, so we await it first.
  // If you're on an older Next.js version, just use `{ params }: { params: { slug: string } }`
  // and remove the `await` below.
  const { slug } = await params;

  // fetch all posts from blogpost.json, then find the one matching this slug
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  // if no post matches this slug, show the built-in 404 page
  if (!post) {
    notFound();
  }

  const currentPost = post as BlogPost;

  // other posts to show at the bottom (excluding the current one)
  const relatedPosts = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="w-full bg-[#F7F8FC] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        {/* back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#063d2d] hover:underline"
        >
          <FaArrowLeft className="h-3 w-3" />
          Back to Blog
        </Link>

        {/* category + title */}
        <span className="mt-6 block text-xs font-bold tracking-wide text-[#0a9b4e]">
          {currentPost.category}
        </span>
        <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-tight text-[#063d2d]">
          {currentPost.title}
        </h1>

        {/* author + meta row */}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={currentPost.author.avatar}
                alt={currentPost.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-[#0b241c]">
              {currentPost.author.name}
            </span>
          </div>

          <span className="flex items-center gap-1.5 text-xs text-[#46605a]">
            <FaRegCalendar className="h-3 w-3" />
            {currentPost.date}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#46605a]">
            <FaRegClock className="h-3 w-3" />
            {currentPost.readTime}
          </span>
        </div>

        {/* cover image */}
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={currentPost.coverImage}
            alt={currentPost.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* article content */}
        <div className="mt-8 flex flex-col gap-5">
          {currentPost.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] leading-relaxed text-[#3f5650] sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-[#c7d3d1] pt-10">
            <h2 className="text-xl font-bold text-[#063d2d]">
              More Articles
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#c7d3d1] bg-white"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold text-[#0a9b4e]">
                      {related.category}
                    </span>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-[#0b241c] group-hover:text-[#063d2d]">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}