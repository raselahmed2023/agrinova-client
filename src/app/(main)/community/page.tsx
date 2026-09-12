"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CloudSun,
  HandCoins,
  Headphones,
  Home,
  ImagePlus,
  Loader2,
  Send,
  Sprout,
  Store,
  Tractor,
  Users,
  X,
} from "lucide-react";

import {
  useSession,
} from "@/lib/auth-client";

import CommunityPostCard from "@/components/community/CommunityPostCard";

import {
  createCommunityPost,
  getCommunityFeed,
  uploadCommunityImage,
} from "@/services/community.service";

import type {
  CommunityPost,
} from "@/types/community";

function initials(
  name?: string | null
) {
  if (!name) {
    return "F";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return parts
    .map(
      (
        part
      ) =>
        part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

  const user =
    session?.user;

  const role =
    String(
      user?.role || ""
    ).toUpperCase();

  const isFarmer =
    role === "FARMER";

  const displayName =
    user?.name ||
    "Farmer";

  const currentUserId =
    user?.id;

  const avatarText =
    useMemo(
      () =>
        initials(
          displayName
        ),
      [displayName]
    );

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
              : "Unable to load Community."
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

  const uploadImage =
    async (
      file?: File
    ) => {
      if (
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

        const url =
          await uploadCommunityImage(
            file
          );

        setImages(
          (
            current
          ) =>
            [
              ...current,
              url,
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

        const created =
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
            created,
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
            : "Unable to create post."
        );
      } finally {
        setPosting(
          false
        );
      }
    };

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

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(240,242,245,.94),rgba(240,242,245,.97)),url('/images/marketplace-bg.jpg')",
      }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-3 py-6 sm:px-5 lg:px-8 xl:grid-cols-[260px_minmax(0,680px)_300px] xl:justify-center">

        {/* ====================================================
            LEFT SIDEBAR
        ===================================================== */}

        <aside className="hidden xl:block">
          <div className="sticky top-[90px] space-y-2">

            {user ? (
              <div className="mb-3 flex items-center gap-3 rounded-xl p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
                  {
                    avatarText
                  }
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">
                    {
                      displayName
                    }
                  </p>

                  <p className="text-xs text-slate-500">
                    {role
                      .toLowerCase()}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                href="/login?redirect=%2Fcommunity"
                className="mb-3 block rounded-xl bg-white p-4 text-sm font-black text-emerald-800 shadow-sm"
              >
                Sign in to participate
              </Link>
            )}

            <SidebarLink
              href={
                isFarmer
                  ? "/dashboard/farmer"
                  : "/"
              }
              icon={
                <Home className="h-5 w-5" />
              }
              label={
                isFarmer
                  ? "Farmer Dashboard"
                  : "Home"
              }
            />

            <SidebarLink
              href="/dashboard/farmer/farms"
              icon={
                <Tractor className="h-5 w-5" />
              }
              label="My Farms"
              hidden={
                !isFarmer
              }
            />

            <SidebarLink
              href="/marketplace"
              icon={
                <Store className="h-5 w-5" />
              }
              label="Marketplace"
            />

            <SidebarLink
              href="/dashboard/farmer/my-investments"
              icon={
                <HandCoins className="h-5 w-5" />
              }
              label="My Investments"
              hidden={
                !isFarmer
              }
            />

            <SidebarLink
              href="/support"
              icon={
                <Headphones className="h-5 w-5" />
              }
              label="B2B Support"
            />
          </div>
        </aside>

        {/* ====================================================
            CENTER FEED
        ===================================================== */}

        <section className="min-w-0">

          {/* MOBILE COMMUNITY HEADER */}

          <div className="mb-4 overflow-hidden rounded-2xl bg-[#063d2e] text-white shadow-sm xl:hidden">
            <div
              className="bg-cover bg-center p-5"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(3,46,35,.84),rgba(3,46,35,.84)),url('/images/marketplace-bg.jpg')",
              }}
            >
              <h1 className="text-2xl font-black">
                Community
              </h1>

              <p className="mt-1 text-sm text-white/80">
                Farmers sharing,
                learning and growing
                together.
              </p>
            </div>
          </div>

          {/* FACEBOOK-STYLE CREATE POST */}

          {isPending ? (
            <div className="mb-4 flex min-h-28 items-center justify-center rounded-xl bg-white shadow-sm">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
            </div>
          ) : isFarmer ? (
            <form
              onSubmit={
                publish
              }
              className="mb-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
                  {
                    avatarText
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
                      event.target
                        .value
                    )
                  }
                  rows={
                    2
                  }
                  maxLength={
                    5000
                  }
                  placeholder={`What's happening on your farm, ${displayName.split(" ")[0]}?`}
                  className="min-h-[52px] flex-1 resize-none rounded-3xl border-0 bg-[#f0f2f5] px-5 py-3.5 text-[15px] leading-6 text-slate-800 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {images.length >
                0 && (
                <div
                  className={`mt-4 grid overflow-hidden rounded-xl gap-1 ${
                    images.length ===
                    1
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  }`}
                >
                  {images.map(
                    (
                      src,
                      index
                    ) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative"
                      >
                        <img
                          src={
                            src
                          }
                          alt="Post upload"
                          className="h-56 w-full object-cover"
                        />

                        <button
                          type="button"
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
                          aria-label="Remove image"
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
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
                        event.target
                          .files?.[0];

                      void uploadImage(
                        file
                      );

                      event.target.value =
                        "";
                    }}
                  />

                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-emerald-600" />
                  )}

                  Photo
                </label>

                <div className="mx-2 h-6 w-px bg-slate-100" />

                <button
                  type="submit"
                  disabled={
                    posting ||
                    uploading ||
                    !content.trim()
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
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
          ) : !user ? (
            <Link
              href="/login?redirect=%2Fcommunity"
              className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Users className="h-5 w-5 text-slate-500" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  Join the conversation
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Sign in as a farmer
                  to post, like,
                  comment and reply.
                </p>
              </div>
            </Link>
          ) : null}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {
                error
              }
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white shadow-sm">
              <Loader2
                aria-label="Loading Community"
                className="h-9 w-9 animate-spin text-emerald-700"
              />
            </div>
          ) : posts.length ===
            0 ? (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Users className="h-7 w-7 text-emerald-600" />
              </div>

              <h2 className="mt-4 text-lg font-black text-slate-900">
                No Community posts
                yet
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Farmer posts will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
        </section>

        {/* ====================================================
            RIGHT SIDEBAR
        ===================================================== */}

        <aside className="hidden xl:block">
          <div className="sticky top-[90px] space-y-4">

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(3,46,35,.25),rgba(3,46,35,.25)),url('/images/marketplace-bg.jpg')",
                }}
              />

              <div className="p-4">
                <h2 className="font-black text-slate-900">
                  AgriNova Community
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Connect with
                  farmers, share field
                  experiences and learn
                  from the community.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900">
                Farming Topics
              </h3>

              <div className="mt-3 space-y-1">
                <Topic
                  icon={
                    <Sprout className="h-4 w-4" />
                  }
                  text="Crop & Soil Care"
                />

                <Topic
                  icon={
                    <Tractor className="h-4 w-4" />
                  }
                  text="Farm Management"
                />

                <Topic
                  icon={
                    <CloudSun className="h-4 w-4" />
                  }
                  text="Weather & Irrigation"
                />

                <Topic
                  icon={
                    <Store className="h-4 w-4" />
                  }
                  text="Selling & Marketplace"
                />
              </div>
            </div>

            <p className="px-2 text-xs leading-5 text-slate-400">
              AgriNova Community is
              for practical farming
              discussion and
              knowledge sharing.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  hidden,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  hidden?: boolean;
}) {
  if (
    hidden
  ) {
    return null;
  }

  return (
    <Link
      href={
        href
      }
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-white/80"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
        {
          icon
        }
      </span>

      {
        label
      }
    </Link>
  );
}

function Topic({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-semibold text-slate-600">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        {
          icon
        }
      </span>

      {
        text
      }
    </div>
  );
}