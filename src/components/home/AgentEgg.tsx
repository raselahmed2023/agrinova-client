"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Leaf,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";

const API_URL =
  process.env
    .NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

type Message = {
  id: string;

  role:
    | "user"
    | "assistant";

  content:
    string;
};

const starter:
  Message[] = [
  {
    id:
      "welcome",

    role:
      "assistant",

    content:
      "Hi! I’m Agent Egg. Ask me about AgriNova, farming, Marketplace, Investment, Community or AI farming tools.",
  },
];

export default function AgentEgg() {
  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );

  const [
    messages,
    setMessages,
  ] =
    useState<
      Message[]
    >(
      starter
    );

  const [
    input,
    setInput,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    jumping,
    setJumping,
  ] =
    useState(
      false
    );

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (
      open
    ) {
      bottomRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",
        }
      );
    }
  }, [
    messages,
    loading,
    open,
  ]);

  /* ============================================================
     JUMP EVERY 10 SECONDS

     Higher jump
     smoother movement
     slight landing shake
  ============================================================ */

  useEffect(() => {
    if (
      open
    ) {
      setJumping(
        false
      );

      return;
    }

    let reset:
      number | undefined;

    const trigger =
      () => {
        setJumping(
          false
        );

        requestAnimationFrame(
          () => {
            requestAnimationFrame(
              () => {
                setJumping(
                  true
                );

                reset =
                  window.setTimeout(
                    () => {
                      setJumping(
                        false
                      );
                    },

                    1250
                  );
              }
            );
          }
        );
      };

    const interval =
      window.setInterval(
        trigger,
        10000
      );

    return () => {
      window.clearInterval(
        interval
      );

      if (
        reset
      ) {
        window.clearTimeout(
          reset
        );
      }
    };
  }, [
    open,
  ]);

  const send =
    async (
      raw:
        string
    ) => {
      const text =
        raw.trim();

      if (
        !text ||
        loading
      ) {
        return;
      }

      setMessages(
        (
          current
        ) => [
          ...current,

          {
            id:
              crypto.randomUUID(),

            role:
              "user",

            content:
              text,
          },
        ]
      );

      setInput(
        ""
      );

      setLoading(
        true
      );

      try {
        const response =
          await fetch(
            `${API_URL}/ai/agent-egg`,

            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    message:
                      text,

                    context:
                      "AgriNova public website",
                  }
                ),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Agent Egg is unavailable."
          );
        }

        setMessages(
          (
            current
          ) => [
            ...current,

            {
              id:
                crypto.randomUUID(),

              role:
                "assistant",

              content:
                data?.data
                  ?.answer ||
                "I could not generate an answer.",
            },
          ]
        );
      } catch {
        setMessages(
          (
            current
          ) => [
            ...current,

            {
              id:
                crypto.randomUUID(),

              role:
                "assistant",

              content:
                "I’m having trouble connecting right now. Please try again.",
            },
          ]
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  const submit =
    (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      void send(
        input
      );
    };

  return (
    <>
      <style jsx global>{`
        @keyframes agrinovaEggJump {
          0% {
            transform:
              translateY(0)
              rotate(0deg)
              scaleX(1)
              scaleY(1);
          }

          8% {
            transform:
              translateY(3px)
              rotate(0deg)
              scaleX(1.05)
              scaleY(0.94);
          }

          20% {
            transform:
              translateY(-8px)
              rotate(-1deg)
              scaleX(0.98)
              scaleY(1.03);
          }

          38% {
            transform:
              translateY(-24px)
              rotate(1deg)
              scaleX(0.98)
              scaleY(1.03);
          }

          48% {
            transform:
              translateY(-28px)
              rotate(0deg)
              scaleX(1)
              scaleY(1);
          }

          60% {
            transform:
              translateY(-18px)
              rotate(-0.5deg)
              scaleX(1)
              scaleY(1);
          }

          70% {
            transform:
              translateY(0)
              rotate(0deg)
              scaleX(1.06)
              scaleY(0.94);
          }

          76% {
            transform:
              translateY(-2px)
              rotate(-3deg)
              scaleX(1)
              scaleY(1);
          }

          82% {
            transform:
              translateY(0)
              rotate(3deg);
          }

          88% {
            transform:
              translateY(0)
              rotate(-2deg);
          }

          94% {
            transform:
              translateY(0)
              rotate(1deg);
          }

          100% {
            transform:
              translateY(0)
              rotate(0deg)
              scaleX(1)
              scaleY(1);
          }
        }

        .agrinova-agent-egg-jump {
          animation:
            agrinovaEggJump
            1.2s
            cubic-bezier(
              0.22,
              0.8,
              0.3,
              1
            )
            both;

          transform-origin:
            50%
            100%;
        }
      `}</style>

      <div className="fixed bottom-5 right-4 z-[80] sm:bottom-7 sm:right-7">

        {open && (
          <section className="mb-4 flex h-[min(620px,calc(100vh-120px))] w-[min(390px,calc(100vw-28px))] flex-col overflow-hidden rounded-[26px] border border-emerald-100 bg-white shadow-2xl">

            <header className="bg-[#063d2e] px-5 py-4 text-white">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative flex h-[52px] w-[42px] items-center justify-center rounded-[50%_50%_46%_46%/58%_58%_42%_42%] bg-gradient-to-b from-[#fffdf3] to-[#f6eac5]">

                    <span className="absolute left-[12px] top-[22px] h-[4px] w-[4px] rounded-full bg-emerald-950" />

                    <span className="absolute right-[12px] top-[22px] h-[4px] w-[4px] rounded-full bg-emerald-950" />

                    <span className="absolute left-1/2 top-[31px] h-[5px] w-[10px] -translate-x-1/2 rounded-b-full border-b-2 border-emerald-900" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">

                      <h2 className="font-black">
                        Agent Egg
                      </h2>

                      <Sparkles className="h-3.5 w-3.5 text-lime-300" />
                    </div>

                    <p className="text-xs text-emerald-100/75">
                      AgriNova AI Guide
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f9f7] p-4">

              {messages.map(
                (
                  message
                ) => (
                  <div
                    key={
                      message.id
                    }
                    className={`flex ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.role ===
                        "user"
                          ? "rounded-br-md bg-emerald-700 text-white"
                          : "rounded-bl-md border bg-white text-slate-700"
                      }`}
                    >
                      {
                        message.content
                      }
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex h-11 w-14 items-center justify-center rounded-2xl bg-white">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                  </div>
                </div>
              )}

              <div
                ref={
                  bottomRef
                }
              />
            </div>

            <form
              onSubmit={
                submit
              }
              className="border-t bg-white p-3"
            >
              <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 p-2">

                <input
                  value={
                    input
                  }
                  onChange={(
                    event
                  ) =>
                    setInput(
                      event.target
                        .value
                    )
                  }
                  placeholder="Ask Agent Egg..."
                  className="min-h-10 flex-1 bg-transparent px-2 text-sm outline-none"
                />

                <button
                  type="submit"
                  disabled={
                    !input.trim() ||
                    loading
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        <button
          type="button"
          onClick={() =>
            setOpen(
              (
                value
              ) =>
                !value
            )
          }
          aria-label="Agent Egg"
          className={`relative flex h-16 w-[52px] items-center justify-center rounded-[50%_50%_46%_46%/58%_58%_42%_42%] border border-[#eadcae] bg-gradient-to-b from-[#fffef7] via-[#fff8de] to-[#f2dfa4] shadow-[0_12px_30px_rgba(6,61,46,.25)] sm:h-[72px] sm:w-[58px] ${
            jumping
              ? "agrinova-agent-egg-jump"
              : ""
          }`}
        >

          <Leaf className="absolute -left-1 top-1 h-4 w-4 -rotate-[35deg] fill-emerald-600 text-emerald-700" />

          <Leaf className="absolute -right-0.5 top-0 h-4 w-4 rotate-[28deg] fill-emerald-500 text-emerald-700" />

          <span className="absolute left-[15px] top-[28px] h-[5px] w-[5px] rounded-full bg-[#164e3c] sm:left-[17px] sm:top-[31px]" />

          <span className="absolute right-[15px] top-[28px] h-[5px] w-[5px] rounded-full bg-[#164e3c] sm:right-[17px] sm:top-[31px]" />

          <span className="absolute left-1/2 top-[39px] h-[6px] w-[12px] -translate-x-1/2 rounded-b-full border-b-[2px] border-[#164e3c] sm:top-[43px]" />

          <span className="absolute bottom-[7px] right-[4px] h-3 w-3 rounded-full border-2 border-[#fff8de] bg-emerald-500" />
        </button>
      </div>
    </>
  );
}