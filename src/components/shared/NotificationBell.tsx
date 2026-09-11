"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";
import type { AppNotification } from "@/types/notification";

const timeAgo = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(Math.floor(diff / 60000), 0);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getMyNotifications(30);
      setItems(result.data);
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error("Notification load failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const readOne = async (item: AppNotification) => {
    if (!item.readAt) {
      setItems((current) =>
        current.map((entry) =>
          entry._id === item._id ? { ...entry, readAt: new Date().toISOString() } : entry
        )
      );
      setUnreadCount((count) => Math.max(count - 1, 0));
      try {
        await markNotificationRead(item._id);
      } catch {
        void load();
      }
    }
    setOpen(false);
  };

  const readAll = async () => {
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      void load();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={readAll}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 disabled:opacity-40"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Loading notifications...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>
            ) : (
              items.map((item) => {
                const body = (
                  <div className={`px-4 py-3 transition hover:bg-slate-50 ${!item.readAt ? "bg-emerald-50/60" : ""}`}>
                    <div className="flex gap-3">
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!item.readAt ? "bg-emerald-600" : "bg-slate-200"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{item.message}</p>
                        <p className="mt-1.5 text-[11px] text-slate-400">{timeAgo(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );

                return item.href ? (
                  <Link key={item._id} href={item.href} onClick={() => void readOne(item)} className="block border-b border-slate-100 last:border-0">
                    {body}
                  </Link>
                ) : (
                  <button key={item._id} type="button" onClick={() => void readOne(item)} className="block w-full border-b border-slate-100 text-left last:border-0">
                    {body}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}