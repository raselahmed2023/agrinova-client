"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  CloudOff,
  CloudSun,
  HandCoins,
  Headphones,
  Home,
  ImagePlus,
  Loader2,
  RefreshCw,
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
  getMyCommunityProfile,
} from "@/services/community.service";

import {
  getStoredLocalImage,
  listStoredLocalImages,
  removeStoredLocalImage,
  retryStoredImage,
  uploadImageWithFallback,
  type StoredLocalImage,
} from "@/lib/image-storage";

import type {
  CommunityPost,
} from "@/types/community";

const MAX_POST_IMAGES = 4;

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
      (part) =>
        part[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function FarmerAvatar({
  name,
  src,
  size = "h-10 w-10",
}: {
  name: string;
  src?: string;
  size?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-black text-emerald-800 ${size}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </div>
  );
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
    localImages,
    setLocalImages,
  ] =
    useState<
      StoredLocalImage[]
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
    retryingKey,
    setRetryingKey,
  ] =
    useState<
      string | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    notice,
    setNotice,
  ] =
    useState("");

  const [
    profileAvatar,
    setProfileAvatar,
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

  const imagePurpose =
    useMemo(
      () =>
        currentUserId
          ? `community-post-${currentUserId}`
          : "community-post-guest",
      [currentUserId]
    );

  const totalImages =
    images.length +
    localImages.length;


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


  useEffect(() => {
    if (
      !isFarmer ||
      !currentUserId
    ) {
      setProfileAvatar(
        ""
      );

      return;
    }

    let active =
      true;

    const profilePurpose =
      `community-profile-${currentUserId}`;

    const localAvatar =
      listStoredLocalImages(
        profilePurpose
      )
        .sort(
          (a, b) =>
            b.createdAt -
            a.createdAt
        )[0];

    if (
      localAvatar?.dataUrl
    ) {
      setProfileAvatar(
        localAvatar.dataUrl
      );
    }

    const loadProfileAvatar =
      async () => {
        try {
          const profile =
            await getMyCommunityProfile();

          if (
            active &&
            !localAvatar?.dataUrl
          ) {
            setProfileAvatar(
              profile.avatar ||
                ""
            );
          }
        } catch {
          // Keep local avatar or initials.
        }
      };

    void loadProfileAvatar();

    const handleProfileUpdate =
      (event: Event) => {
        const customEvent =
          event as CustomEvent<{
            avatar?: string;
          }>;

        if (
          customEvent.detail?.avatar
        ) {
          setProfileAvatar(
            customEvent.detail.avatar
          );
        }
      };

    window.addEventListener(
      "agrinova:profile-updated",
      handleProfileUpdate
    );

    return () => {
      active =
        false;

      window.removeEventListener(
        "agrinova:profile-updated",
        handleProfileUpdate
      );
    };
  }, [
    isFarmer,
    currentUserId,
  ]);


  useEffect(() => {
    if (
      !isFarmer ||
      !currentUserId
    ) {
      setLocalImages(
        []
      );

      return;
    }

    /*
     * Clear legacy browser-only Community images.
     * New uploads must succeed remotely before they are
     * attached to a post. This prevents LOCAL images from
     * looking like successfully uploaded images.
     */
    const saved =
      listStoredLocalImages(
        imagePurpose
      );

    for (const item of saved) {
      removeStoredLocalImage(
        item.localKey
      );
    }

    setLocalImages(
      []
    );
  }, [
    currentUserId,
    imagePurpose,
    isFarmer,
  ]);


  const uploadImage =
    async (
      file?: File
    ) => {
      if (
        !file ||
        uploading ||
        !isFarmer
      ) {
        return;
      }

      if (
        totalImages >=
        MAX_POST_IMAGES
      ) {
        setError(
          `You can attach up to ${MAX_POST_IMAGES} images.`
        );

        return;
      }

      try {
        setUploading(
          true
        );

        setError(
          ""
        );

        setNotice(
          ""
        );

        const result =
          await uploadImageWithFallback(
            file,
            {
              purpose:
                imagePurpose,

              allowLocalFallback:
                false,
            }
          );

        if (
          result.source ===
          "remote"
        ) {
          setImages(
            (current) =>
              [
                ...current,
                result.url,
              ].slice(
                0,
                MAX_POST_IMAGES
              )
          );

          setNotice(
            "Photo uploaded successfully."
          );

          return;
        }

        const stored =
          getStoredLocalImage(
            result.localKey
          );

        if (!stored) {
          throw new Error(
            "The image was saved locally but could not be restored."
          );
        }

        setLocalImages(
          (current) => {
            const alreadyExists =
              current.some(
                (item) =>
                  item.localKey ===
                  stored.localKey
              );

            if (
              alreadyExists
            ) {
              return current;
            }

            return [
              ...current,
              stored,
            ].slice(
              0,
              MAX_POST_IMAGES
            );
          }
        );

        setNotice(
          "Image server is unavailable. Your photo was saved safely in this browser. It will be retried before publishing."
        );
      } catch (
        err
      ) {
        console.error(
          "Community image processing failed:",
          err
        );

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

  const removeRemoteImage =
    (
      index: number
    ) => {
      setImages(
        (current) =>
          current.filter(
            (
              _,
              imageIndex
            ) =>
              imageIndex !==
              index
          )
      );
    };


  const removeLocalImage =
    (
      localKey: string
    ) => {
      removeStoredLocalImage(
        localKey
      );

      setLocalImages(
        (current) =>
          current.filter(
            (item) =>
              item.localKey !==
              localKey
          )
      );

      setNotice(
        ""
      );
    };


  const retryLocalImage =
    async (
      image:
        StoredLocalImage
    ) => {
      if (
        uploading ||
        posting ||
        retryingKey
      ) {
        return;
      }

      try {
        setRetryingKey(
          image.localKey
        );

        setError(
          ""
        );

        setNotice(
          ""
        );

        const remoteUrl =
          await retryStoredImage(
            image.localKey
          );

        setImages(
          (current) =>
            [
              ...current,
              remoteUrl,
            ].slice(
              0,
              MAX_POST_IMAGES
            )
        );

        setLocalImages(
          (current) =>
            current.filter(
              (item) =>
                item.localKey !==
                image.localKey
            )
        );

        setNotice(
          "Photo uploaded successfully."
        );
      } catch (
        err
      ) {
        console.error(
          "Community local image retry failed:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Image service is still unavailable."
        );
      } finally {
        setRetryingKey(
          null
        );
      }
    };

  const uploadPendingLocalImages =
    async () => {
      if (
        localImages.length ===
        0
      ) {
        return [];
      }

      const uploadedUrls:
        string[] =
        [];

      const successfulKeys:
        string[] =
        [];

      try {
        for (
          const localImage of localImages
        ) {
          setRetryingKey(
            localImage.localKey
          );

          const url =
            await retryStoredImage(
              localImage.localKey
            );

          uploadedUrls.push(
            url
          );

          successfulKeys.push(
            localImage.localKey
          );
        }

        setLocalImages(
          []
        );

        return uploadedUrls;
      } catch (
        err
      ) {

        if (
          uploadedUrls.length >
          0
        ) {
          setImages(
            (current) => [
              ...current,
              ...uploadedUrls,
            ].slice(
              0,
              MAX_POST_IMAGES
            )
          );
        }

        if (
          successfulKeys.length >
          0
        ) {
          setLocalImages(
            (current) =>
              current.filter(
                (item) =>
                  !successfulKeys.includes(
                    item.localKey
                  )
              )
          );
        }

        throw err;
      } finally {
        setRetryingKey(
          null
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
        posting ||
        uploading
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

        setNotice(
          ""
        );

        let retriedUrls:
          string[] =
          [];

        if (
          localImages.length >
          0
        ) {
          setNotice(
            "Uploading saved photos before publishing..."
          );

          try {
            retriedUrls =
              await uploadPendingLocalImages();
          } catch (
            retryError
          ) {
            console.error(
              "Unable to upload pending Community images:",
              retryError
            );

            throw new Error(
              "Your photo is still saved safely in this browser, but the image service is unavailable. Please retry the photo before publishing."
            );
          }
        }

        const finalImages =
          [
            ...images,
            ...retriedUrls,
          ].slice(
            0,
            MAX_POST_IMAGES
          );

        const created =
          await createCommunityPost(
            {
              content:
                content.trim(),

              images:
                finalImages,
            }
          );

        setPosts(
          (current) => [
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

        setLocalImages(
          []
        );

        setNotice(
          ""
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

        setRetryingKey(
          null
        );
      }
    };

  const removeFromFeed =
    (
      postId:
        string
    ) => {
      setPosts(
        (current) =>
          current.filter(
            (post) =>
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

        <aside className="hidden xl:block">
          <div className="sticky top-[90px] space-y-2">

            {user ? (
              <div className="mb-3 flex items-center gap-3 rounded-xl p-2">
                <FarmerAvatar
                  name={
                    displayName
                  }
                  src={
                    profileAvatar
                  }
                />

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
                <FarmerAvatar
                  name={
                    displayName
                  }
                  src={
                    profileAvatar
                  }
                />

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

                        <div className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                          Uploaded
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeRemoteImage(
                              index
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



              {localImages.length >
                0 && (
                <div className="mt-4 grid gap-2 overflow-hidden rounded-xl sm:grid-cols-2">
                  {localImages.map(
                    (
                      localImage
                    ) => {
                      const retrying =
                        retryingKey ===
                        localImage.localKey;

                      return (
                        <div
                          key={
                            localImage.localKey
                          }
                          className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50"
                        >
                          <div className="relative">
                            <img
                              src={
                                localImage.dataUrl
                              }
                              alt="Locally saved post upload"
                              className="h-56 w-full object-cover"
                            />

                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                              <CloudOff className="h-3 w-3" />

                              Local
                            </div>

                            <button
                              type="button"
                              disabled={
                                retrying
                              }
                              onClick={() =>
                                removeLocalImage(
                                  localImage.localKey
                                )
                              }
                              aria-label="Remove locally saved image"
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white disabled:opacity-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="p-2">
                            <button
                              type="button"
                              disabled={
                                retrying ||
                                uploading ||
                                posting
                              }
                              onClick={() =>
                                void retryLocalImage(
                                  localImage
                                )
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {retrying ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}

                              {retrying
                                ? "Retrying..."
                                : "Retry upload"}
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}



              {localImages.length >
                0 && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs leading-5 text-amber-900">
                  <CloudOff className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>
                    {
                      localImages.length
                    }
                    {" "}
                    photo
                    {localImages.length >
                    1
                      ? "s are"
                      : " is"}
                    {" "}
                    currently saved only in this browser. AgriNova will retry uploading
                    {localImages.length >
                    1
                      ? " them"
                      : " it"}
                    {" "}
                    automatically when you press Post.
                  </span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                <label
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${
                    uploading ||
                    totalImages >=
                      MAX_POST_IMAGES
                      ? "cursor-not-allowed text-slate-400"
                      : "cursor-pointer text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={
                      uploading ||
                      totalImages >=
                        MAX_POST_IMAGES ||
                      posting
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

                  {totalImages >
                    0 && (
                    <span className="text-xs text-slate-400">
                      {totalImages}
                      /
                      {MAX_POST_IMAGES}
                    </span>
                  )}
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
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      {localImages.length >
                      0
                        ? "Uploading & Posting..."
                        : "Posting..."}
                    </>
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



          {notice && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {
                notice
              }
            </div>
          )}

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

  icon:
    React.ReactNode;

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
  icon:
    React.ReactNode;

  text:
    string;
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