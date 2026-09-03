"use client";

import ReactMarkdown from "react-markdown";

export type ChatRole =
  | "user"
  | "assistant";

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
  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "rounded-br-md bg-[#0B513D] text-white"
            : "rounded-bl-md bg-slate-100 text-slate-700"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}