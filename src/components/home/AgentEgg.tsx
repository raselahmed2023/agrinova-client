"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type Message = { id: string; role: "user" | "assistant"; content: string };

const starter: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi! I’m Agent Egg 🥚🌱. Ask me about AgriNova, farming basics, Marketplace, Investment Projects, AI tools, or where to find something on the site.",
  },
];

const quickQuestions = ["How does investment work?", "How can I sell farm products?", "Where are the AI farming tools?"];

export default function AgentEgg() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(starter);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attentionJump, setAttentionJump] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      setAttentionJump(false);
      return;
    }

    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    const jump = () => {
      setAttentionJump(true);
      resetTimer = setTimeout(() => setAttentionJump(false), 900);
    };

    const interval = setInterval(jump, 10_000);

    return () => {
      clearInterval(interval);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/ai/agent-egg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context: "AgriNova public home page" }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Agent Egg is unavailable right now.");
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data?.data?.answer || "I could not generate an answer." },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent Egg is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[80] sm:bottom-7 sm:right-7">
      {open && (
        <section className="mb-4 flex h-[min(660px,calc(100vh-110px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-2xl shadow-slate-950/20">
          <header className="relative overflow-hidden bg-[#063d2e] px-5 py-4 text-white">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-lime-300/10 blur-2xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[55%_55%_48%_48%] bg-gradient-to-b from-amber-50 to-amber-100 text-emerald-800 shadow-inner">
                  <Bot className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#063d2e] bg-lime-400" />
                </div>
                <div><div className="flex items-center gap-1.5"><h2 className="font-black">Agent Egg</h2><Sparkles className="h-3.5 w-3.5 text-lime-300" /></div><p className="mt-0.5 text-xs text-emerald-100/75">AgriNova public AI guide</p></div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close Agent Egg" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15"><ChevronDown className="h-5 w-5" /></button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8faf8] p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-emerald-700 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>{message.content}</div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">Try asking</p>
                {quickQuestions.map((question) => <button key={question} onClick={() => void send(question)} className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700">{question}</button>)}
              </div>
            )}
            {loading && <div className="flex justify-start"><div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500"><Loader2 className="h-4 w-4 animate-spin text-emerald-600" /> Agent Egg is thinking...</div></div>}
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</div>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={submit} className="border-t border-slate-100 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (input.trim()) void send(input); } }} rows={1} maxLength={1200} placeholder="Ask Agent Egg..." className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400" />
              <button disabled={!input.trim() || loading} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">General guidance only. Agent Egg cannot access your private account data.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close Agent Egg" : "Open Agent Egg"}
        className={`group flex items-center gap-3 rounded-full bg-[#063d2e] p-2.5 pr-4 text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#0a4d3a] ${
          attentionJump ? "motion-safe:animate-bounce" : ""
        }`}
      >
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-amber-50 to-amber-100 text-emerald-800"><span className="absolute inset-x-2 top-2 h-2 rounded-full bg-white/70" />{open ? <X className="relative h-5 w-5" /> : <MessageCircle className="relative h-5 w-5" />}</span>
        <span className="hidden text-left sm:block"><span className="block text-xs font-black">Agent Egg</span><span className="block text-[10px] text-emerald-100/70">Ask AgriNova</span></span>
      </button>
    </div>
  );
}