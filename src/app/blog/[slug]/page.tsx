"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, Loader2, MessageCircle, Reply } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { addBlogComment, addBlogReply, getBlogByIdOrSlug } from "@/services/blog.service";
import type { IBlog, IBlogComment } from "@/types/blog";

export default function BlogDetailsPage() {
  const params = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [comments, setComments] = useState<IBlogComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getBlogByIdOrSlug(params.slug);
      setBlog(result.blog);
      setComments(result.blog.comments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [params.slug]);

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!blog || !commentText.trim()) return;
    try {
      setSubmitting(true);
      const created = await addBlogComment(blog._id, commentText.trim());
      setComments((current) => [...current, created]);
      setCommentText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please sign in to comment");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (commentId: string) => {
    if (!blog || !replyText[commentId]?.trim()) return;
    try {
      setSubmitting(true);
      const created = await addBlogReply(blog._id, commentId, replyText[commentId].trim());
      setComments((current) => current.map((comment) => comment._id === commentId ? { ...comment, replies: [...(comment.replies || []), created] } : comment));
      setReplyText((current) => ({ ...current, [commentId]: "" }));
      setReplyingTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please sign in to reply");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-[65vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>;
  if (!blog) return <div className="mx-auto max-w-3xl p-10 text-center text-red-700">{error || "Article not found"}</div>;

  return (
    <main className="bg-slate-50 py-10">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"><ArrowLeft className="h-4 w-4" />Back to blog</Link>
        <header className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{blog.category}</span><span>{blog.readTime}</span><span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" />{blog.views}</span></div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-5xl">{blog.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{blog.summary}</p>
          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-800">{blog.author.name.charAt(0)}</div><div><p className="font-black text-slate-900">{blog.author.name}</p><p className="text-sm text-slate-500">{blog.author.title || "Agricultural Expert"}</p></div></div>
        </header>

        {blog.images[0] && <img src={blog.images[0]} alt={blog.title} className="mt-7 max-h-[540px] w-full rounded-3xl object-cover shadow-sm" />}

        <div className="prose prose-slate mt-7 max-w-none rounded-3xl border border-slate-200 bg-white p-6 leading-8 shadow-sm md:p-9"><ReactMarkdown>{blog.content}</ReactMarkdown></div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3"><MessageCircle className="h-6 w-6 text-emerald-700" /><div><h2 className="text-xl font-black text-slate-950">Discussion</h2><p className="text-sm text-slate-500">Farmers, experts and admins can comment and reply after signing in.</p></div></div>
          <form onSubmit={submitComment} className="mt-5 flex gap-3"><input value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={1500} placeholder="Ask a question or share an experience..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" /><button disabled={submitting || !commentText.trim()} className="rounded-xl bg-emerald-700 px-5 py-3 font-black text-white disabled:opacity-50">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comment"}</button></form>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

          <div className="mt-7 space-y-5">{comments.length === 0 ? <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">No comments yet. Start the discussion.</p> : comments.map((comment) => <div key={comment._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-black text-slate-900">{comment.userName}</p><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{comment.userRole}</p></div><button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="inline-flex items-center gap-1 text-sm font-bold text-slate-600"><Reply className="h-4 w-4" />Reply</button></div><p className="mt-3 text-sm leading-6 text-slate-700">{comment.content}</p>{comment.replies?.length > 0 && <div className="mt-4 space-y-3 border-l-2 border-emerald-100 pl-4">{comment.replies.map((reply) => <div key={reply._id} className="rounded-xl bg-white p-3"><p className="text-sm font-black text-slate-900">{reply.userName} <span className="ml-2 text-[10px] uppercase text-emerald-700">{reply.userRole}</span></p><p className="mt-1 text-sm text-slate-600">{reply.content}</p></div>)}</div>}{replyingTo === comment._id && <div className="mt-4 flex gap-2"><input value={replyText[comment._id] || ""} onChange={(e) => setReplyText((current) => ({ ...current, [comment._id]: e.target.value }))} maxLength={1000} placeholder="Write a reply..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600" /><button disabled={submitting || !replyText[comment._id]?.trim()} onClick={() => void submitReply(comment._id)} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50">Reply</button></div>}</div>)}</div>
        </section>
      </article>
    </main>
  );
}