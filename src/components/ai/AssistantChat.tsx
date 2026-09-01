"use client";

import {
  ArrowUp,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ChatMessage, {
  type ChatMessageType,
} from "./ChatMessage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const STORAGE_KEY =
  "agrinova-farming-assistant";

const initialMessages: ChatMessageType[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hello! I’m your AgriNova Farming Assistant. How can I help with your farming today?",
  },
];

export default function AssistantChat() {
  const [messages, setMessages] =
    useState<ChatMessageType[]>(initialMessages);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages)
    );
  }, [messages, loaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const sendMessage = async (
    message: string
  ) => {
    const cleanMessage = message.trim();

    if (!cleanMessage || isLoading) return;

    setError("");

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanMessage,
    };

    setMessages((prev) => [
      ...prev,
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
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: cleanMessage,
          }),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to generate a response."
        );
      }

      const assistantMessage: ChatMessageType =
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            result.data?.answer ||
            "I could not generate a response.",
        };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
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

    localStorage.removeItem(
      STORAGE_KEY
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Farming Assistant
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ask any farming-related question.
          </p>
        </div>

        <button
          type="button"
          onClick={clearConversation}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* CHAT */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* MESSAGES */}
        <div className="max-h-[520px] min-h-[320px] space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#0B513D]" />
              Thinking...
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-100 p-4"
        >
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-emerald-500">
            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              rows={2}
              maxLength={2000}
              disabled={isLoading}
              placeholder="Ask your farming question..."
              className="max-h-32 min-h-[48px] flex-1 resize-none border-none bg-transparent px-2 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              disabled={
                isLoading ||
                !input.trim()
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B513D] text-white hover:bg-[#083f30] disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}