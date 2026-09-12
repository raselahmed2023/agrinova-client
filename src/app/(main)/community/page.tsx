"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  LockKeyhole,
  Send,
  Users,
  X,
} from "lucide-react";

import {
  useSession,
} from "@/lib/auth-client";

import CommunityPostCard from "@/components/community/CommunityPostCard";

import type {
  CommunityPost,
} from "@/types/community";

import {
  createCommunityPost,
  getCommunityFeed,
  uploadCommunityImage,
} from "@/services/community.service";

/* ============================================================
   COMMUNITY PAGE

   Access rules:

   PUBLIC:
   - read posts
   - read comments
   - read replies

   FARMER:
   - create post
   - upload photos
   - like
   - comment
   - reply
   - view farmer Community profiles

   LOGGED OUT:
   - actions redirect to login
   - farmer profile access redirects to login
============================================================ */

export default function CommunityPage() {
  const {
    data: session,
    isPending,
  } = useSession();

  const [
    posts,
    setPosts,
  ] =
    useState<
      CommunityPost[]
    >([]);

  const [
    content,
    setContent,
  ] =
    useState("");

  const [
    images,
    setImages,
  ] =
    useState<
      string[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    posting,
    setPosting,
  ] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  /* ============================================================
     SESSION
  ============================================================ */

  const role =
    String(
      session?.user?.role ||
        ""
    ).toUpperCase();

  const isFarmer =
    role === "FARMER";

  const isAuthenticated =
    Boolean(
      session?.user
    );

  const currentUserId =
    session?.user?.id;

  /* ============================================================
     INITIALS
  ============================================================ */

  const initials =
    useMemo(
      () => {
        const name =
          session?.user?.name?.trim();

        if (!name) {
          return "F";
        }

        return name
          .split(/\s+/)
          .map(
            (
              part
            ) =>
              part[0]
          )
          .join("")
          .slice(
            0,
            2
          )
          .toUpperCase();
      },
      [
        session?.user
          ?.name,
      ]
    );

  /* ============================================================
     LOAD PUBLIC FEED
  ============================================================ */

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await getCommunityFeed(
              1,
              30
            );

          setPosts(
            result.posts
          );
        } catch (
          err
        ) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load Community."
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
  }, [load]);

  /* ============================================================
     CREATE POST
  ============================================================ */

  const publish =
    async (
      event:
        React.FormEvent
    ) => {
      event.preventDefault();

      if (
        !isFarmer ||
        !content.trim() ||
        posting
      ) {
        return;
      }

      try {
        setPosting(
          true
        );

        setError(
          ""
        );

        const post =
          await createCommunityPost(
            {
              content:
                content.trim(),

              images,
            }
          );

        setPosts(
          (
            current
          ) => [
            {
              ...post,

              likedByMe:
                false,

              likeCount:
                post.likeCount ??
                0,

              commentCount:
                post.commentCount ??
                0,
            },

            ...current,
          ]
        );

        setContent(
          ""
        );

        setImages(
          []
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not publish post."
        );
      } finally {
        setPosting(
          false
        );
      }
    };

  /* ============================================================
     IMAGE UPLOAD

     IMPORTANT FIX:

     We wait for uploadCommunityImage() FIRST,
     then call setImages().

     Never put `await` inside the setState callback.
  ============================================================ */

  const upload =
    async (
      file?: File
    ) => {
      if (
        !isFarmer ||
        !file ||
        uploading ||
        images.length >=
          4
      ) {
        return;
      }

      try {
        setUploading(
          true
        );

        setError(
          ""
        );

        const uploadedUrl =
          await uploadCommunityImage(
            file
          );

        setImages(
          (
            current
          ) =>
            [
              ...current,
              uploadedUrl,
            ].slice(
              0,
              4
            )
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Image upload failed."
        );
      } finally {
        setUploading(
          false
        );
      }
    };

  /* ============================================================
     REMOVE LOCAL POST AFTER FARMER DELETE
  ============================================================ */

  const removeFromFeed =
    (
      postId:
        string
    ) => {
      setPosts(
        (
          current
        ) =>
          current.filter(
            (
              post
            ) =>
              post._id !==
              postId
          )
      );
    };

  /* ============================================================
     UI
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50/70">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="border-b border-slate-200 bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-50">
            <Users className="h-4 w-4" />

            Farmer Network
          </div>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            AgriNova Community
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/90 sm:text-lg">
            Read farm updates,
            questions, field
            experiences and
            practical discussions
            shared by farmers across
            AgriNova.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 lg:py-10">

        {/* ====================================================
            FARMER POST COMPOSER
        ===================================================== */}

        {!isPending &&
          isFarmer && (
            <form
              onSubmit={
                publish
              }
              className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
                  {
                    initials
                  }
                </div>

                <textarea
                  value={
                    content
                  }
                  onChange={(
                    event
                  ) =>
                    setContent(
                      event
                        .target
                        .value
                    )
                  }
                  rows={
                    3
                  }
                  maxLength={
                    5000
                  }
                  placeholder="What is happening on your farm?"
                  className="min-h-28 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[15px] outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* IMAGES */}

              {images.length >
                0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {images.map(
                    (
                      src,
                      index
                    ) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative overflow-hidden rounded-2xl bg-slate-100"
                      >
                        <img
                          src={
                            src
                          }
                          alt="Community post upload"
                          className="h-44 w-full object-cover"
                        />

                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={() =>
                            setImages(
                              (
                                current
                              ) =>
                                current.filter(
                                  (
                                    _,
                                    imageIndex
                                  ) =>
                                    imageIndex !==
                                    index
                                )
                            )
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white transition hover:bg-slate-950"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* COMPOSER ACTIONS */}

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                <label
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                    uploading ||
                    images.length >=
                      4
                      ? "cursor-not-allowed text-slate-300"
                      : "cursor-pointer text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={
                      uploading ||
                      images.length >=
                        4
                    }
                    onChange={(
                      event
                    ) => {
                      const file =
                        event
                          .target
                          .files?.[0];

                      void upload(
                        file
                      );

                      event.target.value =
                        "";
                    }}
                  />

                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5" />
                  )}

                  Photo

                  {images.length >
                    0 && (
                    <span className="text-xs font-black text-slate-400">
                      {
                        images.length
                      }
                      /4
                    </span>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={
                    posting ||
                    uploading ||
                    !content.trim()
                  }
                  className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {posting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />

                      Post
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        {/* ====================================================
            LOGGED-OUT NOTICE
        ===================================================== */}

        {!isPending &&
          !isAuthenticated && (
            <div className="mb-6 rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-black text-slate-950">
                    Join the conversation
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    You can read
                    Community posts,
                    comments and replies
                    without logging in.
                    Sign in as a Farmer
                    to post, like,
                    comment, reply or
                    open Farmer
                    profiles.
                  </p>

                  <Link
                    href="/login?redirect=%2Fcommunity"
                    className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
                  >
                    Login to participate
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* ====================================================
            NON-FARMER NOTICE
        ===================================================== */}

        {!isPending &&
          isAuthenticated &&
          !isFarmer && (
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
              Community posts,
              comments and replies are
              publicly readable.
              Posting, liking,
              commenting, replying and
              Farmer-profile access are
              reserved for Farmer
              accounts.
            </div>
          )}

        {/* ====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {
              error
            }
          </div>
        )}

        {/* ====================================================
            SESSION SPINNER
        ===================================================== */}

        {isPending && (
          <div className="mb-5 flex min-h-24 items-center justify-center">
            <Loader2
              role="status"
              aria-label="Checking session"
              className="h-7 w-7 animate-spin text-emerald-700"
            />
          </div>
        )}

        {/* ====================================================
            FEED
        ===================================================== */}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Loader2
              role="status"
              aria-label="Loading Community"
              className="h-9 w-9 animate-spin text-emerald-700"
            />
          </div>
        ) : posts.length ===
          0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Users className="h-7 w-7 text-emerald-700" />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-900">
              No Community posts yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Farmer posts will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map(
              (
                post
              ) => (
                <CommunityPostCard
                  key={
                    post._id
                  }
                  initialPost={
                    post
                  }
                  currentUserId={
                    currentUserId
                  }
                  currentUserRole={
                    role
                  }
                  onDeleted={
                    removeFromFeed
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}