import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import BlogDetailsClient from "@/components/blog/BlogDetailsClient";

import {
  getBlogByIdOrSlug,
} from "@/services/blog.service";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export const metadata: Metadata =
  {
    title:
      "Agricultural Knowledge | AgriNova",

    description:
      "Practical farming knowledge and expert agricultural guidance from AgriNova.",
  };

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SingleBlogPage({
  params,
}: BlogPageProps) {
  const {
    slug,
  } =
    await params;

  try {
    const result =
      await getBlogByIdOrSlug(
        slug
      );

    if (
      !result?.blog
    ) {
      notFound();
    }

    return (
      <BlogDetailsClient
        initialData={
          result
        }
      />
    );
  } catch (
    error
  ) {
    console.error(
      "Unable to load blog article:",
      error
    );

    notFound();
  }
}