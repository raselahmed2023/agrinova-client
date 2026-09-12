export interface IBlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  specialization?: string | string[];
  bio?: string;
}

export interface IBlogReply {
  _id: string;
  userId: string;
  userName: string;
  userRole: "FARMER" | "EXPERT" | "ADMIN";
  content: string;
  createdAt: string;
}

export interface IBlogComment {
  _id: string;
  userId: string;
  userName: string;
  userRole: "FARMER" | "EXPERT" | "ADMIN";
  content: string;
  replies: IBlogReply[];
  createdAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  images: string[];
  readTime: string;
  author: IBlogAuthor;
  status: "PUBLISHED" | "DRAFT";
  views: number;
  comments?: IBlogComment[];
  createdAt: string;
  updatedAt?: string;
}

export interface IBlogSingleResponse {
  blog: IBlog;
  nextBlog?: Pick<IBlog, "_id" | "slug" | "title" | "summary" | "images" | "readTime" | "category" | "author"> | null;
  prevBlog?: Pick<IBlog, "_id" | "slug" | "title" | "summary" | "images" | "readTime" | "category" | "author"> | null;
}

export interface IBlogFormData {
  title: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  images: string[];
  status?: "PUBLISHED" | "DRAFT";
}
