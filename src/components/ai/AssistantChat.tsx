"use client";

import {
  ArrowUp,
  Bot,
  CircleAlert,
  Leaf,
  LoaderCircle,
  MessageCircleQuestion,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Waves,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";

import ChatMessage, {
  type ChatMessageType,
} from "./ChatMessage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const suggestions = [
  {
    icon: Waves,
    text: "How often should I irrigate tomato plants?",
  },
  {
    icon: Sprout,
    text: "Which fertilizer is suitable for rice?",
  },
  {
    icon: Leaf,
    text: "How can I improve soil fertility naturally?",
  },
  {
    icon: MessageCircleQuestion,
    text: "What should I do before heavy rainfall?",
  },
];

const initialMessages: ChatMessageType[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hello! I’m your **AgriNova Farming Assistant**. Ask me about crops, irrigation, soil health, fertilizers, weather-related farming decisions, pests, or general farm management.",
  },
];

export default function AssistantChat() {
  const [messages, setMessages] =
    useState<ChatMessageType[]>(initialMessages);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = async (message: string) => {
    const cleanMessage = message.trim();

    if (!cleanMessage || isLoading) return;

    setError("");

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/ai/assistant`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: cleanMessage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to generate a response."
        );
      }

      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          result.data?.answer ||
          "I could not generate a response.",
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);

      window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    void sendMessage(input);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void sendMessage(input);
    }
  };

  const clearConversation = () => {
    setMessages(initialMessages);
    setInput("");
    setError("");
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F3EC] text-[#0B513D]">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="text-sm font-semibold text-[#477A5B]">
              AI Tools
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Farming Assistant
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Get practical guidance for crops, soil,
            irrigation, fertilizers and everyday farm
            management.
          </p>
        </div>

        <button
          type="button"
          onClick={clearConversation}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <RotateCcw className="h-4 w-4" />
          New Conversation
        </button>
      </section>

      {/* Main */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Chat */}
        <section className="flex min-h-[690px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B513D] text-white">
                  <Bot className="h-5 w-5" />
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  AgriNova Assistant
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Smart farming guidance
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full bg-[#F1F7F3] px-3 py-1.5 text-xs font-medium text-[#477A5B] sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              AI-powered
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto bg-[#FBFCFB] p-4 sm:p-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B513D] text-white">
                  <Bot className="h-4 w-4" />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#0B513D]" />
                    Analyzing your question...
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Couldn&apos;t generate a response
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-[#8CB89A] focus-within:ring-4 focus-within:ring-[#0B513D]/5"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, soil, irrigation, fertilizers..."
                rows={2}
                maxLength={2000}
                disabled={isLoading}
                className="max-h-40 min-h-[68px] w-full resize-none border-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <div className="flex items-center justify-between gap-3 px-2 pb-1">
                <p className="hidden text-[11px] text-slate-400 sm:block">
                  Press Enter to send · Shift + Enter
                  for a new line
                </p>

                <p className="text-[11px] text-slate-400 sm:hidden">
                  {input.length}/2000
                </p>

                <button
                  type="submit"
                  disabled={
                    isLoading || !input.trim()
                  }
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084330] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}

                  <span className="hidden sm:inline">
                    Send
                  </span>
                </button>
              </div>
            </form>

            <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
              AI suggestions may not replace
              professional agricultural diagnosis.
            </p>
          </div>
        </section>

        {/* Right Panel */}
        <aside className="space-y-5">
          {/* Suggested Questions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0B513D]" />

              <h2 className="text-sm font-semibold text-slate-900">
                Suggested Questions
              </h2>
            </div>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Try one of these common farming
              questions.
            </p>

            <div className="mt-4 space-y-2.5">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;

                return (
                  <button
                    key={suggestion.text}
                    type="button"
                    onClick={() =>
                      void sendMessage(
                        suggestion.text
                      )
                    }
                    disabled={isLoading}
                    className="group flex w-full items-start gap-3 rounded-xl border border-slate-100 bg-[#FAFBFA] p-3 text-left transition hover:border-[#B9D3C1] hover:bg-[#F2F8F4] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#477A5B] shadow-sm transition group-hover:text-[#0B513D]">
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className="text-xs font-medium leading-5 text-slate-600 group-hover:text-slate-900">
                      {suggestion.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-2xl bg-[#0B513D] p-5 text-white shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Leaf className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-base font-semibold">
              Get better answers
            </h3>

            <p className="mt-2 text-xs leading-6 text-white/75">
              Include details such as crop name,
              location, soil type, growth stage or
              recent weather when asking a question.
            </p>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] leading-5 text-white/70">
                Example
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-white">
                “My tomato plants in Kushtia are at
                flowering stage and the leaves are
                turning yellow. What should I check?”
              </p>
            </div>
          </div>

          {/* Scope */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              I can help with
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Crops",
                "Soil",
                "Irrigation",
                "Fertilizer",
                "Weather",
                "Pests",
                "Harvesting",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#F0F6F2] px-3 py-1.5 text-[11px] font-medium text-[#477A5B]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}