"use client";

import {
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
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
} from "@/services/community.service";

import type {
  CommunityPost,
  CommunityProfileResponse,
} from "@/types/community";

interface CommunityFarmerProfilePageProps {
  params: Promise<{
    farmerId: string;
  }>;
}

function profileInitials(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (
        part: string
      ) =>
        part[0]
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
}: CommunityFarmerProfilePageProps) {
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
    error,
    setError,
  ] =
    useState("");

  const role =
    String(
      session?.user?.role ||
        ""
    ).toUpperCase();

  const currentUserId =
    session?.user?.id;

  const isFarmer =
    role === "FARMER";

  const profileUrl =
    useMemo(
      () =>
        `/community/profile/${farmerId}`,
      [farmerId]
    );

  /* ============================================================
     AUTHORIZATION

     Logged out:
     -> Login

     Logged-in non-Farmer:
     -> Community

     Farmer:
     -> Profile allowed
  ============================================================ */

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
          profileUrl
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
    router,
    profileUrl,
  ]);

  /* ============================================================
     LOAD PROFILE
  ============================================================ */

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

            setData(
              null
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

  /* ============================================================
     SESSION CHECK

     Spinner only.
  ============================================================ */

  if (
    isPending ||
    !session?.user ||
    !isFarmer
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <Loader2
          role="status"
          aria-label="Loading"
          className="h-9 w-9 animate-spin text-emerald-700"
        />
      </div>
    );
  }

  /* ============================================================
     PROFILE LOADING

     Spinner only.
  ============================================================ */

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <Loader2
          role="status"
          aria-label="Loading farmer profile"
          className="h-9 w-9 animate-spin text-emerald-700"
        />
      </div>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-sm font-black text-emerald-700 transition hover:text-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Community
          </Link>

          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
            {error ||
              "Farmer profile not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 lg:py-10">

        {/* BACK */}

        <Link
          href="/community"
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Community
        </Link>

        {/* =====================================================
            SAFE COMMUNITY PROFILE

            No email.
            No phone.
            No NID.
            No private account details.
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="h-32 bg-gradient-to-r from-emerald-950 via-emerald-700 to-lime-600" />

          <div className="px-6 pb-6">

            <div className="-mt-11 flex h-22 w-22 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-xl font-black text-emerald-800 shadow-md">
              {profileInitials(
                data.profile.name
              )}
            </div>

            <h1 className="mt-4 text-2xl font-black text-slate-950">
              {
                data.profile.name
              }
            </h1>

            <p className="mt-1 text-sm font-semibold text-emerald-700">
              AgriNova Farmer
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">

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

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-emerald-700" />

                Joined{" "}
                {new Date(
                  data.profile
                    .joinedAt
                ).toLocaleDateString(
                  undefined,
                  {
                    year:
                      "numeric",

                    month:
                      "long",
                  }
                )}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-700" />

                {
                  data.profile
                    .postCount
                }{" "}
                {data.profile
                  .postCount ===
                1
                  ? "post"
                  : "posts"}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            FARMER POSTS
        ====================================================== */}

        <div className="space-y-5">

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
                  currentUserId
                }
                currentUserRole={
                  role
                }
              />
            )
          )}

          {data.posts.length ===
            0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <Users className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 font-black text-slate-900">
                No Community posts yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                This farmer has not
                shared any Community
                posts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}