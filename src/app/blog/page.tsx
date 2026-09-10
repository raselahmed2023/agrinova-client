import Image from "next/image";
import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";
import {
  FaRegCalendar,
  FaRegClock,
  FaArrowRight,
} from "react-icons/fa";

export interface BlogPost {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "blogpost.json"
  );

  const file = await readFile(filePath, "utf-8");

  return JSON.parse(file) as BlogPost[];
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <section className="w-full bg-[#F7F8FC] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-tight tracking-tight text-[#063d2d]">
            Blog & Farming Guides
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#3f5650] sm:text-base">
            Practical, expert-backed articles on crop care, disease control,
            and efficient farm management — written to help you make better
            decisions in the field.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#c7d3d1] bg-white transition hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(6,61,45,0.1)]"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-bold tracking-wide text-[#0a9b4e]">
                  {post.category}
                </span>

                <h2 className="mt-2 text-lg font-bold leading-snug text-[#0b241c] group-hover:text-[#063d2d]">
                  {post.title}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#46605a]">
                  {post.excerpt}
                </p>

                <div className="mt-5 flex items-center gap-4 text-xs text-[#46605a]">
                  <span className="flex items-center gap-1.5">
                    <FaRegCalendar className="h-3 w-3" />
                    {post.date}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FaRegClock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#063d2d]">
                  Read More
                  <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}