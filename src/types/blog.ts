export interface IBlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  specialization?: string | string[];
  bio?: string;
}

export interface IBlog {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  images: string[]; // 1 to 2 images
  readTime: string;
  author: IBlogAuthor;
  status: "PUBLISHED" | "DRAFT";
  views: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IBlogSingleResponse {
  blog: IBlog;
  nextBlog?: {
    _id: string;
    slug: string;
    title: string;
    summary: string;
    images: string[];
    readTime: string;
    category: string;
    author: IBlogAuthor;
  } | null;
  prevBlog?: {
    _id: string;
    slug: string;
    title: string;
    summary: string;
    images: string[];
    readTime: string;
    category: string;
    author: IBlogAuthor;
  } | null;
}

export interface IBlogFormData {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  images: string[];
  readTime?: string;
  status?: "PUBLISHED" | "DRAFT";
}
