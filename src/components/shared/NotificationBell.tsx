"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  Bell,
  BellOff,
  CheckCheck,
  Loader2,
} from "lucide-react";

import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";

import type {
  AppNotification,
} from "@/types/notification";

const timeAgo = (
  value: string
) => {
  const time =
    new Date(
      value
    ).getTime();

  const diff =
    Date.now() -
    time;

  const minutes =
    Math.max(
      Math.floor(
        diff / 60000
      ),
      0
    );

  if (
    minutes < 1
  ) {
    return "Just now";
  }

  if (
    minutes < 60
  ) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (
    hours < 24
  ) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  return `${days}d ago`;
};

export default function NotificationBell() {
  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    items,
    setItems,
  ] =
    useState<
      AppNotification[]
    >([]);

  const [
    unreadCount,
    setUnreadCount,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(
      null
    );

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          const result =
            await getMyNotifications(
              30
            );

          setItems(
            result.data
          );

          setUnreadCount(
            result.unreadCount
          );
        } catch (
          error
        ) {
          console.error(
            "Notification load failed:",
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void load();

    const timer =
      window.setInterval(
        () =>
          void load(),
        30000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [load]);

  useEffect(() => {
    const handler = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  const readOne =
    async (
      item:
        AppNotification
    ) => {
      if (
        !item.readAt
      ) {
        setItems(
          (
            current
          ) =>
            current.map(
              (
                entry
              ) =>
                entry._id ===
                item._id
                  ? {
                      ...entry,

                      readAt:
                        new Date().toISOString(),
                    }
                  : entry
            )
        );

        setUnreadCount(
          (
            count
          ) =>
            Math.max(
              count - 1,
              0
            )
        );

        try {
          await markNotificationRead(
            item._id
          );
        } catch {
          void load();
        }
      }

      setOpen(
        false
      );
    };

  const readAll =
    async () => {
      setItems(
        (
          current
        ) =>
          current.map(
            (
              item
            ) => ({
              ...item,

              readAt:
                item.readAt ||
                new Date().toISOString(),
            })
          )
      );

      setUnreadCount(
        0
      );

      try {
        await markAllNotificationsRead();
      } catch {
        void load();
      }
    };

  return (
    <div
      ref={
        wrapperRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (
              current
            ) =>
              !current
          )
        }
        aria-label="Notifications"
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
          open
            ? "bg-emerald-50 text-emerald-800"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Bell className="h-[19px] w-[19px]" />

        {unreadCount >
          0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
            {unreadCount >
            9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[48px] z-[100] w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">

          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
            <div>
              <p className="font-black text-slate-900">
                Notifications
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {
                  unreadCount
                }{" "}
                unread
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void readAll()
              }
              disabled={
                unreadCount ===
                0
              }
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-4 w-4" />

              Mark all read
            </button>
          </div>

          <div className="max-h-[440px] overflow-y-auto">
            {loading &&
            items.length ===
              0 ? (
              <div className="flex min-h-40 items-center justify-center">
                <Loader2
                  aria-label="Loading notifications"
                  className="h-7 w-7 animate-spin text-emerald-700"
                />
              </div>
            ) : items.length ===
              0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <BellOff className="h-5 w-5 text-slate-400" />
                </div>

                <p className="mt-3 text-sm font-bold text-slate-700">
                  No notifications yet
                </p>
              </div>
            ) : (
              items.map(
                (
                  item
                ) => {
                  const body =
                    (
                      <div
                        className={`px-4 py-3.5 transition hover:bg-slate-50 ${
                          !item.readAt
                            ? "bg-emerald-50/50"
                            : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              !item.readAt
                                ? "bg-emerald-600"
                                : "bg-slate-200"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900">
                              {
                                item.title
                              }
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                              {
                                item.message
                              }
                            </p>

                            <p className="mt-2 text-[11px] font-medium text-slate-400">
                              {timeAgo(
                                item.createdAt
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );

                  if (
                    item.href
                  ) {
                    return (
                      <Link
                        key={
                          item._id
                        }
                        href={
                          item.href
                        }
                        onClick={() =>
                          void readOne(
                            item
                          )
                        }
                        className="block border-b border-slate-100 last:border-0"
                      >
                        {
                          body
                        }
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={
                        item._id
                      }
                      type="button"
                      onClick={() =>
                        void readOne(
                          item
                        )
                      }
                      className="block w-full border-b border-slate-100 text-left last:border-0"
                    >
                      {
                        body
                      }
                    </button>
                  );
                }
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}