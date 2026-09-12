"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";

import {
  useSession,
} from "@/lib/auth-client";

import CommunityPostCard from "@/components/community/CommunityPostCard";

import {
  getCommunityFarmerProfile,
  updateMyCommunityProfile,
  uploadCommunityImage,
} from "@/services/community.service";

import type {
  CommunityPost,
  CommunityProfileResponse,
} from "@/types/community";

function initials(
  name:
    string
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (
        word
      ) =>
        word[0]
    )
    .join("")
    .slice(
      0,
      2
    )
    .toUpperCase();
}

export default function CommunityFarmerProfilePage({
  params,
}: {
  params: Promise<{
    farmerId: string;
  }>;
}) {
  const {
    farmerId,
  } =
    use(params);

  const router =
    useRouter();

  const {
    data: session,
    isPending,
  } =
    useSession();

  const [
    data,
    setData,
  ] =
    useState<
      CommunityProfileResponse | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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

  const role =
    String(
      session?.user?.role ||
        ""
    ).toUpperCase();

  const userId =
    session?.user?.id;

  const isFarmer =
    role === "FARMER";

  const isOwnProfile =
    Boolean(
      userId &&
        String(
          userId
        ) ===
          String(
            farmerId
          )
    );

  useEffect(() => {
    if (
      isPending
    ) {
      return;
    }

    if (
      !session?.user
    ) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/community/profile/${farmerId}`
        )}`
      );

      return;
    }

    if (
      !isFarmer
    ) {
      router.replace(
        "/community"
      );
    }
  }, [
    isPending,
    session?.user,
    isFarmer,
    farmerId,
    router,
  ]);

  useEffect(() => {
    if (
      isPending ||
      !session?.user ||
      !isFarmer
    ) {
      return;
    }

    let active =
      true;

    const load =
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            await getCommunityFarmerProfile(
              farmerId,
              1,
              30
            );

          if (
            active
          ) {
            setData(
              result
            );
          }
        } catch (
          err
        ) {
          if (
            active
          ) {
            setError(
              err instanceof Error
                ? err.message
                : "Farmer profile not found"
            );
          }
        } finally {
          if (
            active
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void load();

    return () => {
      active =
        false;
    };
  }, [
    farmerId,
    isPending,
    session?.user,
    isFarmer,
  ]);

  const changePhoto =
    async (
      file?:
        File
    ) => {
      if (
        !file ||
        !isOwnProfile
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

        const avatar =
          await uploadCommunityImage(
            file
          );

        const profile =
          await updateMyCommunityProfile(
            {
              avatar,
            }
          );

        setData(
          (
            current
          ) =>
            current
              ? {
                  ...current,

                  profile: {
                    ...current.profile,

                    avatar:
                      profile.avatar,
                  },
                }
              : current
        );

        window.dispatchEvent(
          new CustomEvent(
            "agrinova:profile-updated",

            {
              detail: {
                avatar:
                  profile.avatar,
              },
            }
          )
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not update profile photo"
        );
      } finally {
        setUploading(
          false
        );
      }
    };

  if (
    isPending ||
    loading ||
    !session?.user ||
    !isFarmer
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f0f2f5]">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f0f2f5]">
        <div className="mx-auto max-w-3xl px-4 py-10">

          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-sm font-black text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Community
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
            {error ||
              "Farmer profile not found"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(240,242,245,.95),rgba(240,242,245,.97)),url('/images/marketplace-bg.jpg')",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6">

        <Link
          href="/community"
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Community
        </Link>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {
              error
            }
          </div>
        )}

        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div
            className="h-44 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(4,64,45,.15),rgba(4,64,45,.38)),url('/images/marketplace-bg.jpg')",
            }}
          />

          <div className="px-6 pb-6">

            <div className="-mt-14 flex items-end justify-between gap-4">

              <div className="relative">

                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-emerald-100 text-2xl font-black text-emerald-800 shadow-md">
                  {data.profile
                    .avatar ? (
                    <img
                      src={
                        data.profile
                          .avatar
                      }
                      alt={
                        data.profile
                          .name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(
                      data.profile
                        .name
                    )
                  )}
                </div>

                {isOwnProfile && (
                  <label className="absolute bottom-1 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-700 shadow transition hover:bg-slate-200">

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={
                        uploading
                      }
                      onChange={(
                        event
                      ) => {
                        const file =
                          event
                            .target
                            .files?.[0];

                        void changePhoto(
                          file
                        );

                        event.target.value =
                          "";
                      }}
                    />

                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>
                )}
              </div>
            </div>

            <h1 className="mt-4 text-2xl font-black text-slate-950">
              {
                data.profile
                  .name
              }
            </h1>

            <p className="mt-1 text-sm font-semibold text-emerald-700">
              AgriNova Farmer
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

              {data.profile
                .location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-700" />

                  {
                    data.profile
                      .location
                  }
                </span>
              )}

              {data.profile
                .joinedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-emerald-700" />

                  Joined{" "}
                  {new Date(
                    data.profile
                      .joinedAt
                  ).toLocaleDateString(
                    undefined,
                    {
                      month:
                        "long",

                      year:
                        "numeric",
                    }
                  )}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-700" />

                {
                  data.profile
                    .postCount
                }{" "}
                posts
              </span>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {data.posts.map(
            (
              post:
                CommunityPost
            ) => (
              <CommunityPostCard
                key={
                  post._id
                }
                initialPost={
                  post
                }
                currentUserId={
                  userId
                }
                currentUserRole={
                  role
                }
              />
            )
          )}

          {data.posts.length ===
            0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Users className="mx-auto h-9 w-9 text-slate-300" />

              <p className="mt-3 font-bold text-slate-700">
                No Community posts yet
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}