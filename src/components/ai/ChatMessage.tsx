"use client";

import ReactMarkdown from "react-markdown";
import { Bot, UserRound } from "lucide-react";

export type ChatRole = "user" | "assistant";

export interface ChatMessageType {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B513D] text-white shadow-sm">
          <Bot className="h-4.5 w-4.5" />
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[80%] lg:max-w-[75%] ${
          isUser ? "order-first" : ""
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3.5 text-sm leading-7 sm:px-5 ${
            isUser
              ? "rounded-br-md bg-[#0B513D] text-white shadow-sm"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div
              className="
                prose prose-sm max-w-none
                prose-headings:mb-2 prose-headings:mt-4
                prose-headings:font-semibold prose-headings:text-slate-900
                prose-p:my-2 prose-p:leading-7
                prose-ul:my-2 prose-ol:my-2
                prose-li:my-1
                prose-strong:font-semibold prose-strong:text-slate-900
              "
            >
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <p
          className={`mt-1.5 text-[11px] text-slate-400 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? "You" : "AgriNova Assistant"}
        </p>
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0B513D] shadow-sm">
          <UserRound className="h-4.5 w-4.5" />
        </div>
      )}
    </div>
  );
}